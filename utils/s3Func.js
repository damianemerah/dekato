import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import AppError from "./errorClass";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export const uploadFiles = (files) =>
  files.map(async (file) => {
    let buffer;

    if (file.type.includes("image")) {
      const buf = Buffer.from(await file.arrayBuffer());
      buffer = await sharp(buf).webp({ quality: 90 }).toBuffer();
    }

    if (file.type.includes("video")) {
      if (file.size > 50 * 1024 * 1024) {
        throw new AppError("Video size exceeded. 50MB", 400);
      }

      buffer = Buffer.from(await file.arrayBuffer());
    }

    const slug = slugify(file.name.split(".")[0], { lower: true });

    const fileName = file.type.includes("image")
      ? `image/prod-${uuidv4()}-${slug}.webp`
      : file.type.includes("video")
      ? `video/prod-${uuidv4()}-${slug}.mp4`
      : null;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: buffer,
    };

    const command = new PutObjectCommand(uploadParams);
    const data = await s3.send(command);

    if (!data) throw new AppError("Error uploading files", 400);

    const url =
      `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}
  `.trim();

    return url;
  });

export const deleteFiles = async (files) => {
  const deleteParams = {
    Bucket: process.env.S3_BUCKET,
    Delete: {
      Objects: files.map((file) => ({ Key: file.split(".com/")[1] })),
    },
    Quiet: false,
  };

  console.log(deleteParams, "deleteParams🔥");
  const command = new DeleteObjectsCommand(deleteParams);
  const data = await s3.send(command);

  if (!data) throw new AppError("Error deleting files", 400);
};
