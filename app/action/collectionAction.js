'use server';

import dbConnect from '@/app/lib/mongoConnection';
import Campaign from '@/models/collection';
import Product from '@/models/product';
import { handleFormData } from '@/utils/handleForm';
import { restrictTo } from '@/utils/checkPermission';
import handleAppError from '@/utils/appError';
import { revalidatePath, revalidateTag } from 'next/cache';
import APIFeatures from '@/utils/apiFeatures';

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
  await dbConnect();

  try {
    const query = Campaign.find(
      {},
      'name description image slug createdAt category banner isSale'
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
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function createCollection(formData) {
  await restrictTo('admin');
  await dbConnect();

  try {
    const body = await handleFormData(formData);

    const collection = await Campaign.create(body);
    const leanCollection = await Campaign.findById(collection._id).lean({
      virtuals: true,
    });

    const productCount = await Product.countDocuments({
      collections: collection._id,
    });

    revalidatePath(`/admin/collections/${leanCollection.slug}`);
    return { ...formatCollections([leanCollection])[0], productCount };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function updateCollection(formData) {
  await restrictTo('admin');
  await dbConnect();

  try {
    const id = formData.get('id');
    const data = await handleFormData(formData, Campaign, id);
    const body = Object.fromEntries(
      Object.entries(data).filter(([key]) => formData.get(key))
    );

    const collection = await Campaign.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      select: 'name description image slug createdAt category banner',
    }).lean({ virtuals: true });

    if (!collection) {
      throw new Error('Collection not found');
    }

    const productCount = await Product.countDocuments({
      collections: collection._id,
    });

    revalidatePath(`/admin/collections/${collection.slug}`);
    revalidatePath(`/admin/collections`);
    revalidateTag('products-all');

    return { ...formatCollections([collection])[0], productCount };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function deleteCollection(id) {
  await restrictTo('admin');
  await dbConnect();

  try {
    const deletedCollection = await Campaign.findByIdAndDelete(id).lean({
      virtuals: true,
    });

    if (!deletedCollection) {
      throw new Error('Collection not found');
    }

    revalidatePath('/admin/collections');
    revalidatePath(`/admin/collections/${deletedCollection.slug}`);

    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export const addProductToCollection = async (collectionId, productId) => {
  await restrictTo('admin');
  await dbConnect();

  try {
    const collection = await Campaign.findById(collectionId);
    const product = await Product.findById(productId);

    if (!collection || !product) {
      throw new Error('Collection or product not found');
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
    const error = handleAppError(err);
    throw new Error(error.message);
  }
};

export async function getSaleCollections() {
  await dbConnect();

  try {
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
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}
