import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export const uploadFiles = async (files) => {
  try {
    const uploadPromises = files.map(async (file) => {
      console.log(file.size, "file🔥🔥🔥");
      let buffer;

      if (file.type.includes("image")) {
        const buf = Buffer.from(await file.arrayBuffer());

        console.log(buf.length, "buf🔥🔥🔥");
        buffer = await sharp(buf).webp({ quality: 90 }).toBuffer();
        console.log("Continuing from buffer🔥🔥🔥");
      }

      if (file.type.includes("video")) {
        if (file.size > 50 * 1024 * 1024) {
          throw new Error("Video size exceeded. 50MB");
        }

        buffer = Buffer.from(await file.arrayBuffer());

        console.log("Continuing from buffer2 👇👇");
      }

      const slug = slugify(file.name.split(".")[0], { lower: true });

      const fileName = file.type.includes("image")
        ? `image/prod-${uuidv4()}-${slug}.webp`
        : file.type.includes("video")
          ? `video/prod-${uuidv4()}-${slug}.mp4`
          : null;

      console.log(fileName, "fileName🔥🔥🔥");

      const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: buffer,
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3.send(command);

      console.log(data, "data🔥🔥🔥");

      const url =
        `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}
      `.trim();

      return url;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    throw new Error(`Error uploading file: ${error?.message}`);
  }
};

export const deleteFiles = async (files) => {
  try {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: files.map((file) => {
          const parts = file.split(".com/");

          return parts.length > 1 ? { Key: parts[1] } : { Key: file };
        }),
      },
      Quiet: false,
    };

    const command = new DeleteObjectsCommand(deleteParams);
    await s3.send(command);
  } catch (e) {
    console.log(e, "error🔥🔥");
    throw new Error("Error deleting file");
  }
};
