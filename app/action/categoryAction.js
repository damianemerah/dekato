'use server';

import { cache } from 'react';
import dbConnect from '@/app/lib/mongoConnection';
import Category from '@/models/category';
import Product from '@/models/product';
import { handleFormData } from '@/app/utils/handleForm';
import { restrictTo } from '@/app/utils/checkPermission';
import handleAppError from '@/app/utils/appError';
import APIFeatures from '@/app/utils/apiFeatures';
import { revalidatePath, revalidateTag } from 'next/cache';
import { formatCategories } from '@/app/utils/filterHelpers';

export async function getAllCategories(params) {
  // No authorization check needed as this is a public endpoint

  try {
    await dbConnect();

    const query = Category.find(
      {},
      'name description image slug createdAt parent pinned pinOrder '
    )
      .populate('parent', 'name _id slug')
      .lean({ virtuals: true });

    const searchParams = {
      page: params?.page || 1,
      limit: params?.limit || 20,
    };

    const feature = new APIFeatures(query, searchParams).paginate().sort();

    const categoryData = await feature.query;

    const formattedData = await Promise.all(
      categoryData.map(async ({ _id, parent, ...rest }) => {
        const productCount = await Product.countDocuments({
          category: _id,
        });

        return {
          id: _id.toString(),
          parent: parent
            ? {
                id: parent._id.toString(),
                name: parent.name,
                slug: parent.slug,
              }
            : null,
          productCount,
          ...rest,
        };
      })
    );

    const totalCount = await Category.countDocuments(query.getFilter());

    return { data: formattedData, totalCount, limit: searchParams.limit };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getSubCategories(slug) {
  // No authorization check needed as this is a public endpoint

  try {
    await dbConnect();

    // Early return for search routes
    if (!Array.isArray(slug) || slug[0].toLowerCase() === 'search') {
      return null;
    }

    // Find parent category and populate children
    const parentCategory = await Category.findOne({
      slug: slug[0].toLowerCase(),
    })
      .populate('children', 'name description image slug createdAt')
      .sort({ slug: 1 })
      .lean();

    if (!parentCategory) {
      return null;
    }

    // Format and return the children categories
    const formattedCategories = formatCategories(parentCategory.children || []);
    return formattedCategories;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || 'Something went wrong');
  }
}

export async function createCategory(formData) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const body = await handleFormData(formData);
    console.log(body, 'CreateData');

    const categoryDoc = await Category.create(body);
    const category = categoryDoc.toObject();

    // If parent category is provided, add the category to the parent's children array
    if (category && body.parent) {
      const parentDoc = await Category.findByIdAndUpdate(
        body.parent,
        { $push: { children: category._id } },
        { new: true }
      );

      if (!parentDoc) {
        throw new Error('Parent category not found');
      }

      category.parent = parentDoc._id.toString();
    }

    const { _id, ...rest } = category;

    // Get products count
    const productCount = await Product.countDocuments({
      category: _id,
    });

    revalidatePath(`/admin/categories/${category.slug}`);
    revalidatePath('/');
    revalidateTag('categories');
    return { id: _id.toString(), productCount, ...rest };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || 'An error occurred');
  }
}

export async function updateCategory(formData) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const id = formData.get('id');
    const data = await handleFormData(formData, Category, id);

    console.log(data, 'UpdateData');

    const body = {};

    for (const [key, _] of Object.entries(data)) {
      if (formData.get(key)) {
        body[key] = data[key];
      }
    }

    // Get the current category before update
    const currentCategory = await Category.findById(id);
    if (!currentCategory) {
      throw new Error('Category not found');
    }

    const categoryDoc = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .select('name description image slug createdAt parent pinned pinOrder')
      .populate('parent', 'name _id slug');

    if (!categoryDoc) {
      throw new Error('Category not found');
    }

    const category = categoryDoc.toObject();

    // Handle parent change and update children arrays
    if (
      body.parent !== undefined ||
      body.parent !== null ||
      body.parent !== ''
    ) {
      const newParentId = body.parent;
      const oldParentId = currentCategory.parent;

      // Remove from old parent's children array if parent changed
      if (
        oldParentId &&
        (!newParentId || oldParentId.toString() !== newParentId.toString())
      ) {
        await Category.findByIdAndUpdate(
          oldParentId,
          { $pull: { children: id } }, // Mongoose will convert 'id' to ObjectId
          { new: true }
        );
      }

      // Add to new parent's children array if parent is provided and changed
      if (
        newParentId &&
        (!oldParentId || oldParentId.toString() !== newParentId.toString())
      ) {
        await Category.findByIdAndUpdate(
          newParentId,
          { $addToSet: { children: id } }, // Mongoose will convert 'id' to ObjectId
          { new: true }
        );
      }
    }

    // Get products count
    const productCount = await Product.countDocuments({
      category: category._id,
    });

    // Return category with id instead of _id
    const { _id, parent, ...rest } = category;

    revalidatePath(`/admin/categories/${category.slug}`);
    revalidatePath('/');
    revalidateTag('categories');

    return {
      id: _id.toString(),
      parent: parent
        ? {
            id: parent._id.toString(),
            name: parent.name,
            slug: parent.slug,
          }
        : null,
      productCount,
      ...rest,
    };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || 'An error occurred');
  }
}

export async function deleteCategory(id) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const categoryToDelete = await Category.findById(id);

    if (!categoryToDelete) {
      throw new Error('Category not found');
    }

    // Check if any products are using this category
    const productsUsingCategory = await Product.countDocuments({
      category: id,
    });

    if (productsUsingCategory > 0) {
      throw new Error(
        'Cannot delete category. It is still being used by products.'
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    const orphanedCategories = await Category.find({
      parent: deletedCategory._id,
    }).select('_id');

    if (orphanedCategories.length > 0) {
      await Category.updateMany(
        { parent: deletedCategory._id },
        { parent: null }
      );
    }
    const categoriesWithDeletedChild = await Category.find({
      children: deletedCategory._id,
    });
    for (const category of categoriesWithDeletedChild) {
      category.children = category.children.filter(
        (childId) => !childId.equals(deletedCategory._id)
      );
      await category.save();
    }

    revalidatePath('/admin/categories');
    revalidatePath('/');
    revalidateTag('categories');

    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || 'An error occurred');
  }
}

export const getPinnedCategoriesByParent = cache(async (parentSlug) => {
  await dbConnect();

  try {
    let parentCategory;
    if (parentSlug) {
      parentCategory = await Category.findOne({ slug: parentSlug }).lean();
      if (!parentCategory) {
        return [];
      }
    }

    const pinnedCategories = await Category.find({
      parent: parentCategory?._id,
      pinned: true,
    })
      .sort({ pinOrder: 1 })
      .limit(5)
      .lean();

    return pinnedCategories.map((category) => ({
      ...category,
      id: category._id.toString(),
      _id: category._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching pinned categories:', error);
    return [];
  }
});

export const getAllFormattedCategories = cache(async () => {
  await dbConnect();

  try {
    const categories = await Category.find({ parent: null })
      .populate('children', 'name _id slug path')
      .lean({ virtuals: true });

    return formatCategories(categories);
  } catch (err) {
    console.error('Error fetching categories for sidebar:', err);
    return []; // Return empty array to prevent UI errors
  }
});
