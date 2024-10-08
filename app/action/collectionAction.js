"use server";

import dbConnect from "@/lib/mongoConnection";
import Collection from "@/models/collection";
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
    const collections = await Collection.find(
      {},
      "name description image slug createdAt productCount",
    ).lean({ virtuals: true });

    return formatCollections(collections);
  } catch (err) {
    throw handleAppError(err, "Something went wrong");
  }
}

export async function createCollection(formData) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const body = await handleFormData(formData);
    const collection = await Collection.create(body);
    const leanCollection = await Collection.findById(collection._id).lean({
      virtuals: true,
    });

    revalidatePath(`/admin/collections/${leanCollection.slug}`);
    return formatCollections([leanCollection])[0];
  } catch (err) {
    throw handleAppError(err, "An error occurred");
  }
}

export async function updateCollection(formData) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const id = formData.get("id");
    const data = await handleFormData(formData, Collection, id);
    const body = Object.fromEntries(
      Object.entries(data).filter(([key]) => formData.get(key)),
    );

    const collection = await Collection.findByIdAndUpdate(id, body, {
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
    throw handleAppError(err, "An error occurred");
  }
}

export async function deleteCollection(id) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const deletedCollection = await Collection.findByIdAndDelete(id).lean({
      virtuals: true,
    });

    if (!deletedCollection) {
      throw new Error("Collection not found");
    }

    revalidatePath("/admin/collections");
    revalidatePath(`/admin/collections/${deletedCollection.slug}`);

    return null;
  } catch (err) {
    throw handleAppError(err, "An error occurred");
  }
}
