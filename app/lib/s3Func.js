'use server';

import slugify from 'slugify';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export const uploadFiles = async (
  filesToUpload,
  fileType = '',
  productName = ''
) => {
  console.log('filesToUpload🔥🔥', filesToUpload);
  console.log('fileType🔥🔥', fileType);
  console.log('productName🔥🔥', productName);

  // Before upload logic
  const allowedPaths = ['image', 'blog', 'variant', 'blog-images'];
  if (!allowedPaths.includes(fileType)) {
    throw new Error(`Invalid file type: ${fileType}`);
  }
  let files = filesToUpload;
  if (filesToUpload instanceof FormData) {
    files = Array.from(filesToUpload.values());
  }
  if (!Array.isArray(files)) {
    files = [files];
  }
  try {
    const uploadPromises = files.map(async (file, index) => {
      let buffer;

      if (file.type.includes('image') || file.type.includes('video')) {
        if (file.type.includes('video') && file.size > 50 * 1024 * 1024) {
          throw new Error('Video size exceeded. 50MB');
        }
        buffer = Buffer.from(await file.arrayBuffer());
      }
      if (file.type.includes('image')) {
        const buf = Buffer.from(await file.arrayBuffer());

        // Only compress if file size is over 2MB
        if (file.size > 2 * 1024 * 1024) {
          // Use lossy compression for large files
          buffer = await sharp(buf).webp({ quality: 60 }).toBuffer();
        } else {
          // Maintain original quality for smaller files
          if (file.type.endsWith('webp')) {
            // Keep WebP files in original format
            buffer = await sharp(buf).toBuffer();
          } else if (file.type.endsWith('avif')) {
            // Keep AVIF files in original format
            buffer = await sharp(buf).toBuffer();
          } else {
            // Convert other formats to WebP while maintaining quality
            buffer = await sharp(buf).webp({ quality: 100 }).toBuffer();
          }
        }
      }

      // Create slug from product name if available, fallback to file name
      const nameToSlug = productName || file.name.split('.')[0];
      const slug = slugify(nameToSlug, { lower: true });

      // Add index to filename to handle multiple files
      const fileName = file.type.includes('image')
        ? `${fileType}/${slug}-${index + 1}-${nanoid(8)}.webp`
        : file.type.includes('video')
          ? `${fileType}/${slug}-${index + 1}-${nanoid(8)}.mp4`
          : null;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ServerSideEncryption: 'AES256',
        ContentType: file.type,
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3.send(command);

      const url = `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${fileName}`;

      return url;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.log(`Error uploading file: ${error?.message}`);
    throw new Error(`Error uploading file: ${error?.message}`);
  }
};

export const deleteFiles = async (files) => {
  try {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: files.map((file) => {
          const parts = file.split('.com/');

          return parts.length > 1 ? { Key: parts[1] } : { Key: file };
        }),
      },
      Quiet: false,
    };

    const command = new DeleteObjectsCommand(deleteParams);
    await s3.send(command);
  } catch (e) {
    console.error(e, 'S3 error🔥🔥');
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
