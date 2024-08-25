import AppError from "@/utils/errorClass";
import { uploadFiles, deleteFiles } from "@/lib/s3Func";

//Model here is designed to be only Product model
export const handleFormData = async (formData, Model, id) => {
  const obj = {};
  obj.image = [];
  obj.video = [];
  obj.category = [];
  obj.variant = [];
  const filesToUpload = [];
  const variantsFilesToUpload = [];
  const filesToDelete = [];
  let existingProd;

  const images = formData.getAll("image");
  const videos = formData.getAll("video");

  if (images.length === 0 && videos.length === 0) {
    throw new AppError("Please upload image", 400);
  }

  // add other form data to obj
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("variantData")) {
      const index = key.match(/\d+/)[0];
      const data = JSON.parse(value);
      if (!obj.variant[index]) {
        obj.variant[index] = { ...data };
      } else {
        obj.variant[index] = { ...obj.variant[index], ...data };
      }
    }
    if (key.startsWith("variantImage")) {
      const index = key.match(/\d+/)[0];
      if (typeof value === "string") {
        obj.variant[index] = { ...obj.variant[index], image: value };
      }
      variantsFilesToUpload[index] = value;
    }
    if (key !== "image" && key !== "video" && key !== "category") {
      obj[key] = value;
    }
    //category is an array
    if (key === "category") {
      obj.category.push(value);
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
      throw new AppError(`${Model} not found`, 404);
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

  //upload variant images
  const variantImages = await Promise.all(
    variantsFilesToUpload.map(async (file) => {
      if (file.size > 0) {
        return await uploadFiles([file]);
      }
    }),
  );

  obj.variant = obj.variant.map((variant, index) => {
    if (variantImages[index]) {
      return { ...variant, image: variantImages[index][0] };
    }
    return variant;
  });

  return obj;
};
