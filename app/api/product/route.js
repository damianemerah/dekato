import dbConnect from "@/utils/mongoConnection";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import APIFeatures from "@/utils/apiFeatures";
import AppError from "@/utils/errorClass";
import { uploadFiles } from "@/utils/s3Func";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(req) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      console.log("You need to be logged in to create a product🚀🚀🚀");
    } else {
      console.log("You are logged in🚀🚀🚀");
    }
    await dbConnect();
    // const sampleProducts = [
    //   {
    //     name: "T-Shirt",
    //     description: "Comfortable cotton T-Shirt",
    //     price: 19.99,
    //     images: ["tshirt_image1.jpg", "tshirt_image2.jpg"],
    //     categoryId: "65ac5486e6b69d93b64d3cdf",
    //     variants: [
    //       { color: "Red", size: "Medium", price: 19.99, quantity: 50 },
    //       { color: "Blue", size: "Large", price: 22.99, quantity: 30 },
    //     ],
    //     quantity: 80,
    //     tags: ["Casual", "Cotton", "Summer"],
    //     status: "active",
    //   },
    //   {
    //     name: "Sneakers",
    //     description: "Sporty sneakers for active lifestyle",
    //     price: 49.99,
    //     images: ["sneakers_image1.jpg", "sneakers_image2.jpg"],
    //     categoryId: "65ac5485e6b69d93b64d3cdc",
    //     variants: [
    //       { color: "White", size: "US 9", price: 49.99, quantity: 20 },
    //       { color: "Black", size: "US 10", price: 54.99, quantity: 15 },
    //     ],
    //     quantity: 35,
    //     tags: ["Sportswear", "Athletic", "Running"],
    //     status: "active",
    //   },
    //   // Add more products as needed
    // ];

    // for (const product of sampleProducts) {
    //   await Product.create(product);
    // }

    const formData = await req.formData();

    if (!formData || !formData.has("images")) {
      throw new AppError("Please upload images", 400);
    }

    const obj = {};
    obj.images = [];
    obj.videos = [];
    const images = formData.getAll("images");
    const videos = formData.getAll("videos");
    const files = [];

    for (const [key, value] of formData.entries()) {
      if (key === "images" || key === "videos") continue;
      obj[key] = value;
    }

    for (const image of images) {
      if (typeof image === "string") {
        obj.images.push(image);
      } else if (image.type.includes("image")) {
        files.push(image);
      }
    }

    for (const video of videos) {
      if (typeof video === "string") {
        obj.videos.push(video);
      } else if (video.type.includes("video")) {
        files.push(video);
      }
    }

    //upload files to s3
    const fileNames = await Promise.all(uploadFiles(files));
    obj.images = [
      ...obj.images,
      ...fileNames.filter((file) => file.includes("com/image/")),
    ];
    obj.videos = [
      ...obj.videos,
      ...fileNames.filter((file) => file.includes("com/video/")),
    ];

    //create product
    const product = await Product.create(obj);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    const feature = new APIFeatures(Product.find(), searchParams)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const product = await feature.query;

    return NextResponse.json({
      success: true,
      result: product.length,
      data: product,
    });
  } catch (error) {
    return handleAppError(error, req);
  }
}
