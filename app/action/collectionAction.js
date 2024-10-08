"use server";

import dbConnect from "@/lib/mongoConnection";
import Campaign from "@/models/collection";
import Product from "@/models/product";
import { handleFormData } from "@/utils/handleForm";
import { restrictTo } from "@/utils/checkPermission";
import handleAppError from "@/utils/appError";
import { revalidatePath } from "next/cache";

function formatCollections(collections) {
  const formattedCollections = collections.map(
    ({ _id, createdAt, ...rest }) => ({
      id: _id.toString(),
      ...rest,
      createdAt: createdAt?.toISOString(),
    }),
  );

  return formattedCollections;
}

export async function getAllCollections() {
  await dbConnect();

  try {
    const collections = await Campaign.find(
      {},
      "name description image slug createdAt productCount",
    ).lean({ virtuals: true });

    return formatCollections(collections);
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(err.message, "Something went wrong");
  }
}

export async function createCollection(formData) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const body = await handleFormData(formData);
    const collection = await Campaign.create(body);
    const leanCollection = await Campaign.findById(collection._id).lean({
      virtuals: true,
    });

    revalidatePath(`/admin/collections/${leanCollection.slug}`);
    return formatCollections([leanCollection])[0];
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function updateCollection(formData) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const id = formData.get("id");
    const data = await handleFormData(formData, Campaign, id);
    const body = Object.fromEntries(
      Object.entries(data).filter(([key]) => formData.get(key)),
    );

    const collection = await Campaign.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      select: "name description image slug createdAt productCount",
    }).lean({ virtuals: true });

    if (!collection) {
      throw new Error("Collection not found");
    }

    revalidatePath(`/admin/collections/${collection.slug}`);
    revalidatePath(`/admin/collections`);

    return formatCollections([collection])[0];
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function deleteCollection(id) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const deletedCollection = await Campaign.findByIdAndDelete(id).lean({
      virtuals: true,
    });

    if (!deletedCollection) {
      throw new Error("Collection not found");
    }

    revalidatePath("/admin/collections");
    revalidatePath(`/admin/collections/${deletedCollection.slug}`);

    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export const addProductToCollection = async (collectionId, productId) => {
  await restrictTo("admin");
  await dbConnect();

  try {
    const collection = await Campaign.findById(collectionId);
    const product = await Product.findById(productId);

    if (!collection || !product) {
      throw new Error("Collection or product not found");
    }

    collection.products.push(product);
    await collection.save();

    revalidatePath(`/admin/collections/${collection.slug}`);
    revalidatePath(`/admin/collections`);

    return formatCollections([collection])[0];
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
};
