import dbConnect from "@/utils/mongoConnection";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import { uploadFiles, deleteFiles } from "@/utils/s3Func";

export async function GET(req, { params }) {
  try {
    const id = params.id;
    await dbConnect();

    const product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const id = params.id;
    const formData = await req.formData();

    if (!formData || !formData.has("images")) {
      throw new AppError("Please upload product image", 400);
    }

    const body = {};
    body.images = [];
    body.videos = [];
    const fileDelete = [];
    const files = [];

    for (const [key, value] of formData.entries()) {
      if (key === "images" || key === "videos") continue;
      body[key] = value;
    }

    // check if product exist
    const existingProd = await Product.findById(id);
    if (!existingProd) {
      throw new AppError("Product not found", 404);
    }

    //filter images to upload
    const images = formData.getAll("images");

    for (const image of images) {
      if (typeof image === "string" || existingProd.images.includes(image)) {
        body.images.push(image);
      } else if (image.type.includes("image")) {
        files.push(image);
      }
    }

    //filter videos to upload
    const videos = formData.getAll("videos");

    for (const video of videos) {
      if (typeof video === "string" || existingProd.videos.includes(video)) {
        body.videos.push(video);
        console.log("🔥🔥🔥🔥🔥🔥exist", video);
      } else if (video.type.includes("video")) {
        files.push(video);
        console.log("🔥🔥🔥🔥🔥🔥new", video);
      }
    }

    //filter files to delete
    for (const image of existingProd.images) {
      if (!body.images.includes(image)) {
        fileDelete.push(image);
      }
    }

    for (const video of existingProd.videos) {
      if (!body.videos.includes(video)) {
        fileDelete.push(video);
      }
    }

    // console.log("🔥🚀 ===> PATCH ===> fileDelete", fileDelete);

    //delete and upload S3 files
    fileDelete.length > 0 && (await deleteFiles(fileDelete));
    const fileNames =
      files.length > 0 ? await Promise.all(uploadFiles(files)) : [];

    //add new files
    body.images = [
      ...body.images,
      ...fileNames.filter((file) => file.includes("com/image/")),
    ];

    body.videos = [
      ...body.videos,
      ...fileNames.filter((file) => file.includes("com/video/")),
    ];

    //update product
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    await dbConnect();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ data: null }, { status: 204 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
