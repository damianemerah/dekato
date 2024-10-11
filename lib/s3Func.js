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

export const uploadFiles = async (files, fileType = "") => {
  try {
    const uploadPromises = files.map(async (file) => {
      let buffer;

      if (file.type.includes("image") || file.type.includes("video")) {
        if (file.type.includes("video") && file.size > 50 * 1024 * 1024) {
          throw new Error("Video size exceeded. 50MB");
        }
        buffer = Buffer.from(await file.arrayBuffer());
      }

      // if (file.type.includes("image")) {
      //   const buf = Buffer.from(await file.arrayBuffer());

      //   buffer = await sharp(buf).webp().toBuffer();
      // }

      // if (file.type.includes("video")) {
      //   if (file.size > 50 * 1024 * 1024) {
      //     throw new Error("Video size exceeded. 50MB");
      //   }

      //   buffer = Buffer.from(await file.arrayBuffer());
      // }

      const slug = slugify(file.name.split(".")[0], { lower: true });

      const fileName = file.type.includes("image")
        ? `${fileType}/prod-${uuidv4()}-${slug}.webp`
        : file.type.includes("video")
          ? `${fileType}/prod-${uuidv4()}-${slug}.mp4`
          : null;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: buffer,
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3.send(command);

      const url =
        `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}
      `.trim();

      return url;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.log(`Error uploading file: ${error?.message}`);
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
    console.log(e, "S3 error🔥🔥");
  }
};

async function listFilesInS3(bucketName) {
  let allFiles = [];
  let continuationToken = null;

  do {
    const params = {
      Bucket: process.env.S3_BUCKET,
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
    };

    const response = await s3.listObjectsV2(params).promise();
    allFiles = allFiles.concat(response.Contents.map((item) => item.Key));
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return allFiles;
}
