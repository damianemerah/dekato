'use server';

import dbConnect from '@/app/lib/mongoConnection';
import Campaign from '@/models/collection';
import Product from '@/models/product';
import { handleFormData } from '@/app/utils/handleForm';
import { restrictTo } from '@/app/utils/checkPermission';
import { handleError } from '@/app/utils/appError';
import { revalidatePath, revalidateTag } from 'next/cache';
import APIFeatures from '@/app/utils/apiFeatures';
import AppError from '@/app/utils/errorClass';

function formatCollections(collections) {
  const formattedCollections = collections.map(
    ({ _id, createdAt, ...rest }) => ({
      id: _id.toString(),
      ...rest,
      createdAt: createdAt?.toISOString(),
    })
  );

  return formattedCollections;
}

export async function getAllCollections(params) {
  // No authorization check needed as this is a public endpoint

  await dbConnect();

  try {
    const query = Campaign.find(
      {},
      'name description image slug createdAt category banner isSale path'
    )
      .populate('category', 'name slug')
      .lean({ virtuals: true });

    const searchParams = {
      page: params?.page || 1,
      limit: params?.limit || 20,
    };

    const feature = new APIFeatures(query, searchParams).paginate().sort();

    const collectionData = await feature.query;

    const formattedData = await Promise.all(
      collectionData.map(async ({ _id, ...rest }) => {
        const productCount = await Product.countDocuments({
          collections: _id,
        });

        return {
          id: _id.toString(),
          productCount,
          ...rest,
        };
      })
    );

    const totalCount = await Campaign.countDocuments(query.getFilter());

    return { data: formattedData, totalCount, limit: searchParams.limit };
  } catch (err) {
    return handleError(err);
  }
}

export async function createCollection(formData) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const body = await handleFormData(formData);

    const collection = await Campaign.create(body);
    const leanCollection = await Campaign.findById(collection._id).lean({
      virtuals: true,
    });

    const productCount = await Product.countDocuments({
      collections: collection._id,
    });

    revalidatePath(`/admin/collections/${leanCollection.slug}`);
    revalidatePath('/', 'layout');
    revalidateTag('collections');

    return { ...formatCollections([leanCollection])[0], productCount };
  } catch (err) {
    return handleError(err);
  }
}

export async function updateCollection(formData) {
  await restrictTo('admin');
  try {
    await dbConnect();
    const id = formData.get('id');
    const data = await handleFormData(formData, Campaign, id);

    const collection = await Campaign.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      select: 'name description image slug createdAt category banner',
    }).lean({ virtuals: true });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    const productCount = await Product.countDocuments({
      collections: collection._id,
    });

    revalidatePath(`/admin/collections/${collection.slug}`);
    revalidatePath(`/admin/collections`);
    revalidateTag('products-all');
    revalidatePath('/', 'layout');
    revalidateTag('collections');

    return { ...formatCollections([collection])[0], productCount };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteCollection(id) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const deletedCollection = await Campaign.findByIdAndDelete(id).lean({
      virtuals: true,
    });

    if (!deletedCollection) {
      throw new AppError('Collection not found', 404);
    }

    revalidatePath('/admin/collections');
    revalidatePath(`/admin/collections/${deletedCollection.slug}`);
    revalidatePath('/');
    revalidateTag('collections');

    return null;
  } catch (err) {
    return handleError(err);
  }
}

export const addProductToCollection = async (collectionId, productId) => {
  await restrictTo('admin');

  try {
    await dbConnect();
    const collection = await Campaign.findById(collectionId);
    const product = await Product.findById(productId);

    if (!collection || !product) {
      throw new AppError('Collection or product not found', 404);
    }

    collection.products.push(product);
    await collection.save();

    const productCount = await Product.countDocuments({
      collections: collection._id,
    });

    revalidatePath(`/admin/collections/${collection.slug}`);
    revalidatePath(`/admin/collections`);

    return { ...formatCollections([collection.toObject()])[0], productCount };
  } catch (err) {
    return handleError(err);
  }
};

export async function getSaleCollections() {
  // No authorization check needed as this is a public endpoint

  await dbConnect();

  const saleCollections = await Campaign.find({ isSale: true }).lean({
    virtuals: true,
  });

  if (!saleCollections || saleCollections.length === 0) {
    return [];
  }

  const formattedCollections = await Promise.all(
    saleCollections.map(async (collection) => {
      const productCount = await Product.countDocuments({
        collections: collection._id,
      });
      return { ...collection, productCount };
    })
  );

  return formatCollections(formattedCollections);
}
