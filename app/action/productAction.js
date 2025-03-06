'use server';

import Product from '@/models/product';
import Category from '@/models/category';
import Campaign from '@/models/collection';
import APIFeatures from '@/app/utils/apiFeatures';
import { handleFormData } from '@/app/utils/handleForm';
import { restrictTo } from '@/app/utils/checkPermission';
import dbConnect from '@/app/lib/mongoConnection';
import { getQueryObj } from '@/app/utils/getFunc';
import handleAppError from '@/app/utils/appError';
import { revalidatePath, revalidateTag } from 'next/cache';
import { deleteFiles } from '@/app/lib/s3Func';

const formatProduct = (product, isAdmin = false) => {
  const { _id, category, campaign, variant = [], ...rest } = product;

  const formattedProduct = {
    id: _id.toString(),
    ...rest,
    category: category?.map(({ _id, ...c }) => ({ id: _id.toString(), ...c })),
    campaign: campaign?.map(({ _id, ...c }) => ({ id: _id.toString(), ...c })),
    variant: variant?.map(({ _id, ...v }) => ({ id: _id.toString(), ...v })),
  };

  if (!isAdmin) {
    formattedProduct.variant = formattedProduct.variant.filter(
      (v) => v.quantity > 0
    );
  }

  return formattedProduct;
};

const setupIndexes = async () => {
  try {
    console.log('Setting up indexes...');
    await dbConnect();
    // await Promise.all([
    //   Product.collection.createIndex({
    //     name: "text",
    //     description: "text",
    //     tag: "text",
    //   }),
    //   Product.collection.createIndex({ cat: 1 }),
    //   Product.collection.createIndex({ price: 1 }),
    //   Product.collection.createIndex({ slug: 1 }),
    // ]);
    Product.collection.createIndex({
      name: 'text',
      description: 'text',
      tag: 'text',
    });
  } catch (error) {
    console.error('Error setting up indexes:', error);
  }
};

export async function setProductStatus(id, status) {
  await dbConnect();
  try {
    const product = await Product.findByIdAndUpdate(id, { status }).lean({
      virtuals: true,
    });
    return formatProduct(product);
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function updateProductDiscount(
  productId,
  discountData,
  campaignId = null
) {
  await restrictTo('admin');
  await dbConnect();

  try {
    const { discount, discountDuration } = discountData;

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    product.discount = discount;
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
    const error = handleAppError(err);
    throw new Error(error.message);
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
  try {
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
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function productSearch(searchQuery) {
  try {
    await dbConnect();
    const productData = await handleProductQuery(
      Product.find({ status: 'active', quantity: { $gt: 0 } })
        .select('name slug image status')
        .lean(),
      { ...searchQuery, limit: 9 }
    );

    const products = productData.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    const categories = await handleProductQuery(
      Category.find().select('name slug').lean(),
      { ...searchQuery, limit: 6 }
    );

    return { products, categories };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
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
    console.error('Error in getVariantsByCategory:', err);
    return []; // Return empty array on error
  }
}

export async function getAllProducts(slugArray, searchParams = {}) {
  try {
    await dbConnect();

    let categories = [];
    let campaigns = [];
    let baseQuery = Product.find({ quantity: { $gt: 0 }, status: 'active' });
    let isFallback = false;
    searchParams.limit = 20;
    const lastSlug = slugArray[slugArray.length - 1].toLowerCase();

    if (lastSlug !== 'search') {
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

    const limit = parseInt(newSearchParams.limit) || 20;
    const page = parseInt(newSearchParams.page) || 1;
    const totalCount = await Product.countDocuments(feature.query.getFilter());

    let result = {
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

    return result;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getProductById(id) {
  try {
    await dbConnect();
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('campaign', 'name slug')
      .lean({ virtuals: true });
    if (!product) throw new Error('Product not found');
    return formatProduct(product);
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getAdminProductById(id) {
  try {
    await dbConnect();
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('campaign', 'name slug')
      .lean({ virtuals: true });
    if (!product) throw new Error('Product not found');
    return formatProduct(product, true);
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function createProduct(formData) {
  try {
    await restrictTo('admin');
    await dbConnect();

    const obj = await handleFormData(formData);

    const createdProduct = await Product.create(obj);
    if (!createdProduct) throw new Error('Product not created');

    const productDoc = createdProduct.toObject();

    revalidateProduct(productDoc.slug);
    const product = formatProduct(productDoc);
    return product;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function updateProduct(formData) {
  try {
    await restrictTo('admin');
    await dbConnect();

    const id = formData.get('id');
    if (!id) throw new Error('Product not found');

    const data = await handleFormData(formData);

    const productData = await Product.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
      lean: true,
    });

    revalidateProduct(productData.slug);

    return formatProduct(productData);
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export const deleteProduct = async (id) => {
  try {
    await restrictTo('admin');
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
    const error = handleAppError(err);
    throw new Error(error.message);
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
