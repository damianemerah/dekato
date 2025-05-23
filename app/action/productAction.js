'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cache } from 'react';
import Product from '@/models/product';
import Category from '@/models/category';
import Campaign from '@/models/collection';
import OptionGroup from '@/models/variantsOption';
import APIFeatures from '@/app/utils/apiFeatures';
import { handleFormData } from '@/app/utils/handleForm';
import { restrictTo } from '@/app/utils/checkPermission';
import dbConnect from '@/app/lib/mongoConnection';
import { getQueryObj } from '@/app/utils/getFunc';
import { handleError } from '@/app/utils/appError';
import { deleteFiles } from '@/app/lib/s3Func';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserActivity from '@/models/userActivity';
import AppError from '@/app/utils/errorClass';

const formatProduct = (product, isAdmin = false) => {
  const { _id, category, campaign, variant = [], ...rest } = product;

  const formattedProduct = {
    id: _id.toString(),
    ...rest,
    category: category?.map(({ _id, ...c }) => ({ id: _id.toString(), ...c })),
    campaign: campaign?.map(({ _id, ...c }) => ({ id: _id.toString(), ...c })),
    variant: variant?.map(({ _id, optionType = [], ...v }) => ({
      id: _id.toString(),
      optionType: optionType.map(({ _id, labelId, ...ot }) => ({
        id: _id?.toString(),
        labelId: labelId
          ? {
              id: labelId._id?.toString(),
              name: labelId.name,
              values: labelId.values,
              swatchUrl: labelId.swatchUrl,
            }
          : labelId,
        ...ot,
      })),
      ...v,
    })),
  };

  if (!isAdmin) {
    formattedProduct.variant = formattedProduct.variant.filter(
      (v) => v.quantity > 0
    );
  }

  return formattedProduct;
};

export async function setProductStatus(id, status) {
  await restrictTo('admin');

  await dbConnect();
  try {
    const product = await Product.findByIdAndUpdate(id, { status }).lean({
      virtuals: true,
    });
    return formatProduct(product);
  } catch (err) {
    return handleError(err);
  }
}

function calculateDiscountPrice(price, discount) {
  return +(price - (price * discount) / 100).toFixed(2);
}

export async function updateProductDiscount(
  productId,
  discountData,
  campaignId = null
) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const { discount, discountDuration } = discountData;

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const discountValue = calculateDiscountPrice(
      product.price,
      product.discount
    );
    product.discount = discountValue === 0 ? 0 : discount;
    product.discountPrice = discountValue === 0 ? 0 : discountValue;
    product.discountDuration = discountDuration;

    if (campaignId) {
      // Use $addToSet to ensure uniqueness
      await Product.findByIdAndUpdate(
        productId,
        { $addToSet: { campaign: campaignId } },
        { new: true }
      );
    }

    await product.save();

    revalidateProduct(product._id.toString());

    // Fetch the updated product to ensure we have the latest data
    const updatedProduct = await Product.findById(productId);
    return formatProduct(updatedProduct.toObject(), true);
  } catch (err) {
    return handleError(err);
  }
}

const handleProductQuery = async (query, searchParams = {}) => {
  const feature = new APIFeatures(query, searchParams)
    .filter()
    .search()
    .sort()
    .paginate();

  const productData = await feature.query;

  if (!productData?.length) return [];
  return productData;

  // return productData.map(formatProduct);
};

export async function getAdminProduct(params) {
  await restrictTo('admin');

  await dbConnect();

  const query = Product.find()
    .populate('category', 'name')
    .populate('campaign', 'name')
    .lean();
  const searchParams = {
    sort: '-createdAt',
    page: params.page || 1,
    limit: params.limit || 20,
  };
  const productData = await handleProductQuery(query, searchParams);
  const products = productData.map((product) => formatProduct(product, true));
  const totalCount = await Product.countDocuments(query.getFilter());
  return { data: products, totalCount, limit: searchParams.limit };
}

export async function productSearch(searchQuery) {
  // No authorization check needed as this is a public endpoint

  try {
    await dbConnect();

    // Create a base query for products
    let productQuery = Product.find({
      status: 'active',
      quantity: { $gt: 0 },
    })
      .select('name slug image status price discount')
      .lean();

    // Add text search if q parameter exists
    if (searchQuery.q) {
      const searchRegex = new RegExp(searchQuery.q, 'i');
      productQuery = productQuery.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tag: searchRegex },
        ],
      });
    }

    // If category is specified and is a string (not ObjectId), find by slug
    if (searchQuery.category && typeof searchQuery.category === 'string') {
      // Find the category by slug first
      const category = await Category.findOne({
        slug: searchQuery.category.toLowerCase(),
      }).lean();

      if (category) {
        // Use the category ObjectId in the product query
        productQuery = productQuery.find({ category: category._id });
      }
      // If category not found, we'll just continue with other filters
    }

    // Execute the query with limit
    const productData = await productQuery.limit(9);

    const products = productData.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    if (!products || products.length === 0) {
      return {
        products: [],
        totalCount: 0,
        currentPage: page,
        limit,
      };
    }

    // Get categories related to the search
    const categories = await Category.find({
      $or: [
        { name: { $regex: searchQuery.q || '', $options: 'i' } },
        { description: { $regex: searchQuery.q || '', $options: 'i' } },
      ],
    })
      .populate('parent', 'name slug')
      .select('name slug path parent')
      .limit(6)
      .lean();

    return { products, categories };
  } catch (err) {
    return { products: [], categories: [] };
  }
}

export async function getVariantsByCategory(catArr, searchStr = '') {
  try {
    await dbConnect();
    let matchCondition = {};

    if (searchStr && catArr[0].toLowerCase() === 'search') {
      const regexPattern = searchStr
        .split(' ')
        .map((word) => `\\b${word.trim()}`)
        .join('.*');
      matchCondition = {
        $or: [
          { name: { $regex: regexPattern, $options: 'i' } },
          { description: { $regex: regexPattern, $options: 'i' } },
          { tag: { $elemMatch: { $regex: regexPattern, $options: 'i' } } },
        ],
      };
    } else if (Array.isArray(catArr) && catArr[0].toLowerCase() !== 'search') {
      let category;
      let campaign;

      if (catArr.length === 2) {
        // Find child category with parent/child path
        const path = `${catArr[0]}/${catArr[1]}`;

        category = await Category.findOne({ path: { $in: [path] } }).lean();

        if (!category) {
          campaign = await Campaign.findOne({ path: { $in: [path] } }).lean();
        }
      } else if (catArr.length === 1) {
        // Find parent category
        category = await Category.findOne({
          slug: catArr[0].toLowerCase(),
          parent: null,
        }).lean();
        if (!category) {
          campaign = await Campaign.findOne({
            slug: catArr[0].toLowerCase(),
          }).lean();
        }
      }

      if (!category && !campaign) {
        return []; // Return empty if no match found
      }

      if (campaign) {
        matchCondition = { campaign: campaign._id };
      } else {
        matchCondition = {
          category: {
            $in: [category._id, ...(category.children || [])],
          },
        };
      }
    } else {
      return [];
    }

    const variantData = await Product.aggregate([
      { $match: matchCondition },
      { $unwind: '$variant' },
      { $project: { _id: 0, variant: 1 } },
    ]);

    return variantData.map(({ variant }) => ({
      variant: { id: variant._id.toString(), ...variant },
    }));
  } catch (err) {
    return []; // Return empty array on error
  }
}

export const getAllProducts = cache(async (slugArray, searchParams = {}) => {
  try {
    await dbConnect();

    let categories = [];
    let campaigns = [];
    let baseQuery = Product.find({ quantity: { $gt: 0 }, status: 'active' });
    let isFallback = false;
    searchParams.limit = 20;

    // Handle the case when slugArray is empty or invalid
    if (!Array.isArray(slugArray) || slugArray.length === 0) {
      // Return a default query for all products
      const populatedQuery = baseQuery
        .select(
          'name slug _id image price discount status quantity discountPrice discountDuration variant'
        )
        .populate('category', 'name slug path')
        .populate('campaign', 'name slug path')
        .lean({ virtuals: true });

      const newSearchParams = getQueryObj(searchParams);
      const feature = new APIFeatures(populatedQuery, newSearchParams)
        .filter()
        .search()
        .sort()
        .paginate();
      const productData = await feature.query;

      if (!productData?.length) return [];

      const data = productData.map(formatProduct);
      const limit = Number.parseInt(newSearchParams.limit) || 20;
      const page = Number.parseInt(newSearchParams.page) || 1;
      const totalCount = await Product.countDocuments(
        feature.query.getFilter()
      );

      return {
        isCampaign: false,
        data,
        totalCount,
        currentPage: page,
        limit,
      };
    }

    const lastSlug = slugArray[slugArray.length - 1].toLowerCase();

    // Special handling for search queries
    if (lastSlug === 'search' && searchParams.q) {
      const searchStr = searchParams.q;
      const regexPattern = searchStr
        .split(' ')
        .map((word) => `\\b${word.trim()}`)
        .join('.*');

      baseQuery = Product.find({
        $and: [
          { quantity: { $gt: 0 }, status: 'active' },
          {
            $or: [
              { name: { $regex: regexPattern, $options: 'i' } },
              { description: { $regex: regexPattern, $options: 'i' } },
              { tag: { $elemMatch: { $regex: regexPattern, $options: 'i' } } },
            ],
          },
        ],
      })
        .select(
          'name slug _id image price discount status quantity discountPrice discountDuration variant'
        )
        .populate('category', 'name slug path')
        .populate('campaign', 'name slug path');
    } else if (lastSlug !== 'search') {
      // Existing category logic remains the same
      // (keeping the existing code here)

      if (slugArray.length === 1) {
        // Case 1: Single slug (e.g., [men] or [jeans])
        const topLevelCategory = await Category.findOne({
          slug: slugArray[0],
          parent: null,
        }).lean();

        if (topLevelCategory) {
          // It's a top-level category, fetch all subcategories
          categories = await Category.find({
            parent: topLevelCategory._id,
          }).lean();
          categories.push(topLevelCategory);
        } else {
          // It's not a top-level category, find all categories with this slug in their path
          categories = await Category.find({
            path: { $in: [slugArray[0], new RegExp(`/${slugArray[0]}$`)] },
          }).lean();
        }

        // Check for campaigns
        campaigns = await Campaign.find({
          path: { $in: [slugArray[0], new RegExp(`/${slugArray[0]}$`)] },
        }).lean();
      } else if (slugArray.length > 1) {
        // Case 2: Multiple slugs (e.g., [men, jeans])
        const exactPath = slugArray.join('/');
        categories = await Category.find({ path: exactPath }).lean();
        campaigns = await Campaign.find({ path: exactPath }).lean();

        if (categories.length === 0 && campaigns.length === 0) {
          // If no exact match, fallback to the parent category
          const parentSlug = slugArray[0];
          const parentCategory = await Category.findOne({
            slug: parentSlug,
            parent: null,
          }).lean();
          if (parentCategory) {
            // Get all subcategories with parent = parentCategory
            const subCategories = await Category.find({
              parent: parentCategory._id,
            }).lean();
            categories = [parentCategory, ...subCategories];
            isFallback = true;
          }
        }
      }

      if (categories.length === 0 && campaigns.length === 0) return null;

      const categoryIds = categories.map((cat) => cat._id);
      const campaignIds = campaigns.map((camp) => camp._id);

      baseQuery = Product.find({
        $or: [
          { category: { $in: categoryIds } },
          { campaign: { $in: campaignIds } },
        ],
        status: 'active',
      })
        .select(
          'name slug _id image price discount status quantity discountPrice discountDuration variant'
        )
        .populate('category', 'name slug path')
        .populate('campaign', 'name slug path');
    }

    // Rest of the function remains the same
    const populatedQuery = baseQuery.lean({ virtuals: true });
    const newSearchParams = getQueryObj(searchParams);

    const feature = new APIFeatures(populatedQuery, newSearchParams)
      .filter()
      .search()
      .sort()
      .paginate();

    let productData = await feature.query;

    if (!productData?.length) return [];

    if (searchParams['color-vr']) {
      const colorVariants = searchParams['color-vr'].split(',');

      // Expand products with matching color variants
      const expandedProducts = productData.flatMap((product) => {
        const matchingVariants =
          product.variant?.filter((v) => {
            return (
              v.options?.color?.toLowerCase() &&
              colorVariants.includes(v.options.color.toLowerCase())
            );
          }) || [];

        if (matchingVariants.length === 0) return [];

        // Create a product entry for each matching color variant
        return matchingVariants.map((variant) => ({
          ...product,
          image: variant.image
            ? [
                variant.image,
                ...product.image.filter((img) => img !== variant.image),
              ]
            : product.image,
        }));
      });

      // Replace productData with expanded variant products
      productData = expandedProducts;
    }

    const data = productData.map(formatProduct);

    const isCampaign = campaigns.length > 0 && !isFallback;

    const limit = Number.parseInt(newSearchParams.limit) || 20;
    const page = Number.parseInt(newSearchParams.page) || 1;
    const totalCount = await Product.countDocuments(feature.query.getFilter());

    const result = {
      isCampaign,
      data,
      totalCount,
      currentPage: page,
      limit,
    };

    // Get description based on exact path match
    const exactPath = slugArray.join('/');
    let description;

    if (isCampaign) {
      const matchedCampaign = await Campaign.findOne({ path: exactPath })
        .select('banner description')
        .lean();

      if (matchedCampaign) {
        description = matchedCampaign.description;
        if (matchedCampaign.banner) {
          result.banner = matchedCampaign.banner;
        }
      }
    } else {
      const matchedCategory = await Category.findOne({ path: exactPath })
        .select('description')
        .lean();
      if (matchedCategory) {
        description = matchedCategory.description;
      }
    }

    if (description) {
      result.description = description;
    }

    // For search results, add a custom description
    if (lastSlug === 'search' && searchParams.q) {
      result.description = `Search results for "${searchParams.q}"`;
    }

    return result;
  } catch (err) {
    console.error('Error in getAllProducts:', err);
    // Return empty result instead of throwing
    return {
      isCampaign: false,
      data: [],
      totalCount: 0,
      currentPage: 1,
      limit: 20,
    };
  }
});

export const getProductById = cache(async (id) => {
  await dbConnect();
  const product = await Product.findById(id)
    .populate('category', 'name slug')
    .populate('campaign', 'name slug')
    .populate('variant.optionType.labelId', 'name values swatchUrl')
    .lean({ virtuals: true });
  if (!product) throw new Error('Product not found');
  return formatProduct(product);
});

export async function getAdminProductById(id) {
  await dbConnect();
  const product = await Product.findById(id)
    .populate('category', 'name slug')
    .populate('campaign', 'name slug')
    .populate('variant.optionType.labelId', 'name values swatchUrl')
    .lean({ virtuals: true });
  if (!product) throw new Error('Product not found');
  return formatProduct(product, true);
}

export async function createProduct(formData) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const obj = await handleFormData(formData);

    const createdProduct = await Product.create(obj);
    if (!createdProduct) throw new AppError('Product not created', 400);

    const productDoc = createdProduct.toObject();

    revalidateProduct(productDoc.slug);
    const product = formatProduct(productDoc);
    return product;
  } catch (err) {
    return handleError(err);
  }
}

export async function updateProduct(formData) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const id = formData.get('id');
    if (!id) throw new AppError('Product not found', 404);

    const data = await handleFormData(formData);

    const productData = await Product.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
      lean: true,
    });

    revalidateProduct(productData.slug);

    return formatProduct(productData);
  } catch (err) {
    return handleError(err);
  }
}

export const deleteProduct = async (id) => {
  await restrictTo('admin');

  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) throw new Error('Product not found');

    const imagesToDelete = [
      ...product.image,
      ...(product.video || []),
      ...(product.variant?.flatMap((v) => v.image) || []),
    ].filter(Boolean);

    if (imagesToDelete.length) await deleteFiles(imagesToDelete);

    revalidateProduct(product.slug);

    return null;
  } catch (err) {
    return handleError(err);
  }
};

export async function getProductsByCategory(cat) {
  await dbConnect();
  const products = await Product.find({ cat })
    .populate('category', 'name slug')
    .populate('campaign', 'name slug')
    .lean();
  return products.map((product) => {
    const formattedProduct = formatProduct(product);
    if (formattedProduct.category) {
      formattedProduct.category = formattedProduct.category.map(
        ({ id, ...rest }) => ({ id, ...rest })
      );
    }
    return formattedProduct;
  });
}

export async function getProductByCollection(slug) {
  await dbConnect();
  const product = await Product.findOne({ campaign: slug }).lean();
  return formatProduct(product);
}

function revalidateProduct(id) {
  revalidatePath(`/admin/products/${id}`);
  revalidateTag('single-product-data');
  revalidateTag('products-all');
  revalidatePath('/admin/products');
  // revalidateTag("checkout-data");
}

// Call setupIndexes when the module is first loaded
// setupIndexes();

// Cached server action for recommended products
export const getRecommendedProducts = cache(
  async (category = null, limit = 8) => {
    await dbConnect();

    try {
      // Get user session for personalized recommendations
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;

      const query = {
        status: 'active',
        quantity: { $gt: 0 },
      };

      // Add category filter if provided
      if (category) {
        const categoryDoc = await Category.findOne({ slug: category }).select(
          '_id'
        );
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }

      // Get user activity for personalized recommendations
      let userActivity = null;
      if (userId) {
        userActivity = await UserActivity.findOne({ userId })
          .select('recentlyViewed naughtyList')
          .lean();

        // Exclude products in naughty list
        if (userActivity?.naughtyList?.length > 0) {
          query._id = { $nin: userActivity.naughtyList };
        }

        // Prioritize categories from recently viewed products
        if (userActivity?.recentlyViewed?.length > 0) {
          const recentProductIds = userActivity.recentlyViewed
            .slice(0, 5)
            .map((item) => item.productId);

          const recentProducts = await Product.find({
            _id: { $in: recentProductIds },
          })
            .select('category')
            .lean();

          const categoryIds = new Set();
          recentProducts.forEach((product) => {
            product.category?.forEach((catId) =>
              categoryIds.add(catId.toString())
            );
          });

          if (categoryIds.size > 0) {
            query.category = { $in: Array.from(categoryIds) };
          }
        }
      }

      // Find products based on query
      const products = await Product.find(query)
        .sort({
          discount: -1,
          viewCount: -1,
          purchaseCount: -1,
          createdAt: -1,
        })
        .limit(limit)
        .populate('category', 'name slug')
        .lean({ virtuals: true });

      // Format products for client
      return products.map((product) => {
        const { _id, category, campaign, variant = [], ...rest } = product;

        return {
          id: _id.toString(),
          ...rest,
          category: category?.map(({ _id, ...c }) => ({
            id: _id.toString(),
            ...c,
          })),
          campaign: campaign?.map(({ _id, ...c }) => ({
            id: _id.toString(),
            ...c,
          })),
          variant: variant
            .filter((v) => v.quantity > 0)
            .map(({ _id, ...v }) => ({
              id: _id.toString(),
              ...v,
            })),
        };
      });
    } catch (err) {
      console.error('Error fetching recommended products:', err);
      return [];
    }
  }
);

export const getProductByIdCached = cache(async (id) => {
  try {
    await dbConnect();
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('campaign', 'name slug')
      .populate('variant.optionType.labelId', 'name values swatchUrl')
      .lean({ virtuals: true });

    if (!product) throw new Error('Product not found');

    const { _id, category, campaign, variant = [], ...rest } = product;

    return {
      id: _id.toString(),
      ...rest,
      category: category?.map(({ _id, ...c }) => ({
        id: _id.toString(),
        ...c,
      })),
      campaign: campaign?.map(({ _id, ...c }) => ({
        id: _id.toString(),
        ...c,
      })),
      variant: variant.map(({ _id, optionType = [], ...v }) => ({
        id: _id.toString(),
        optionType: optionType.map(({ _id, labelId, ...ot }) => ({
          id: _id?.toString(),
          labelId: labelId
            ? {
                id: labelId._id?.toString(),
                name: labelId.name,
                values: labelId.values,
                swatchUrl: labelId.swatchUrl,
              }
            : labelId,
          ...ot,
        })),
        ...v,
      })),
    };
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return handleError(err);
  }
});
