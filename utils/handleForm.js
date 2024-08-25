import AppError from "@/utils/errorClass";
import { uploadFiles, deleteFiles } from "@/lib/s3Func";

//Model here is designed to be only Product model
export const handleFormData = async (formData, Model, id) => {
  const obj = {};
  obj.image = [];
  obj.video = [];
  const filesToUpload = [];
  const filesToDelete = [];
  let existingProd;

  //check if image is uploaded

  const media = formData.getAll("media");

  if (
    media.length === 0 ||
    media.some((file) => !file.type.startsWith("image/"))
  ) {
    throw new AppError("Please upload image", 400);
  }

  const images = media.filter((file) => file.type.startsWith("image/"));
  const videos = media.filter((file) => file.type.startsWith("video/"));

  // add other form data to obj
  for (const [key, value] of formData.entries()) {
    if (key !== "media") {
      obj[key] = value;
    }
  }

  images.forEach((file) => {
    if (typeof file === "string") {
      obj.image.push(file);
    } else if (file.size > 0) {
      filesToUpload.push(file);
    }
  });

  videos.forEach((file) => {
    if (typeof file === "string") {
      obj.video.push(file);
    } else if (file.size > 0) {
      filesToUpload.push(file);
    }
  });

  // check if model and id is provided & get existing product
  if (Model && id) {
    existingProd = await Model.findById(id);
    if (!existingProd) {
      throw new AppError("Product not found", 404);
    }
  }

  //delete existing files
  if (existingProd) {
    const imagesToDelete = existingProd.image.filter(
      (img) => !obj.image.includes(img),
    );
    const videosToDelete = existingProd.video
      ? existingProd.video.filter((vid) => !obj.video.includes(vid))
      : [];

    filesToDelete.push(...imagesToDelete, ...videosToDelete);

    if (filesToDelete.length > 0) {
      await deleteFiles(filesToDelete);
    }
  }

  //upload files to s3
  const fileNames =
    filesToUpload.length > 0 ? await uploadFiles(filesToUpload) : [];

  obj.image = [
    ...obj.image,
    ...fileNames.filter((file) => file.includes("com/image/")),
  ];

  obj.video = [
    ...obj.video,
    ...fileNames.filter((file) => file.includes("com/video/")),
  ];

  return obj;
};
