import AppError from "@/utils/errorClass";
import { uploadFiles, deleteFiles } from "@/lib/s3Func";
import Category from "@/models/category";

export const handleFormData = async (formData, Model, id) => {
  const obj = {
    image: [],
    video: [],
    category: [],
    variant: [],
  };
  const filesToUpload = [];
  const variantsFilesToUpload = [];
  const filesToDelete = [];
  let existingProd;

  validateFormData(formData);

  processFormEntries(formData, obj, filesToUpload, variantsFilesToUpload);

  if (Model && id) {
    existingProd = await findExistingProduct(Model, id);
  }

  if (existingProd) {
    await handleExistingFiles(existingProd, obj, filesToDelete);
  }

  const uploadedFileNames = await uploadNewFiles(filesToUpload);
  updateObjWithUploadedFiles(obj, uploadedFileNames);

  await handleVariantImages(obj, variantsFilesToUpload);

  if (Model === Category) {
    obj.parent = obj.parent || null;
  }

  return obj;
};

function validateFormData(formData) {
  const status = formData.get("status");
  const images = formData.getAll("image");
  const videos = formData.getAll("video");

  if (status === "active") {
    if (!formData.get("category")) {
      throw new AppError("Category is required", 400);
    }
    if (images.length === 0 && videos.length === 0) {
      throw new AppError("Please upload image", 400);
    }
  }
}

function processFormEntries(
  formData,
  obj,
  filesToUpload,
  variantsFilesToUpload,
) {
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("variantData")) {
      processVariantData(obj, key, value);
    } else if (key.startsWith("variantImage")) {
      processVariantImage(obj, variantsFilesToUpload, key, value);
    } else if (key === "category") {
      obj.category.push(value);
    } else if (key === "image" || key === "video") {
      processMediaFile(obj, filesToUpload, key, value);
    } else {
      obj[key] = value;
    }
  }
}

function processVariantData(obj, key, value) {
  const index = key.match(/\d+/)[0];
  const data = JSON.parse(value);
  obj.variant[index] = { ...obj.variant[index], ...data };
}

function processVariantImage(obj, variantsFilesToUpload, key, value) {
  const index = key.match(/\d+/)[0];
  if (typeof value === "string") {
    obj.variant[index] = { ...obj.variant[index], image: value };
  }
  variantsFilesToUpload[index] = value;
}

function processMediaFile(obj, filesToUpload, key, file) {
  if (typeof file === "string") {
    obj[key].push(file);
  } else if (file.size > 0) {
    filesToUpload.push(file);
  }
}

async function findExistingProduct(Model, id) {
  if (Array.isArray(id)) {
    const existingProds = await Model.find({ _id: { $in: id } });
    if (existingProds.length !== id.length) {
      throw new AppError(`One or more ${Model.modelName}s not found`, 404);
    }
    return existingProds;
  } else {
    const existingProd = await Model.findById(id);
    if (!existingProd) {
      throw new AppError(`${Model.modelName} not found`, 404);
    }
    return existingProd;
  }
}

async function handleExistingFiles(existingProd, obj, filesToDelete) {
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

async function uploadNewFiles(filesToUpload) {
  return filesToUpload.length > 0 ? await uploadFiles(filesToUpload) : [];
}

function updateObjWithUploadedFiles(obj, uploadedFileNames) {
  obj.image.push(
    ...uploadedFileNames.filter((file) => file.includes("com/image/")),
  );
  obj.video.push(
    ...uploadedFileNames.filter((file) => file.includes("com/video/")),
  );
}

async function handleVariantImages(obj, variantsFilesToUpload) {
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
}
