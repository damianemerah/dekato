import AppError from "@/utils/errorClass";
import { uploadFiles, deleteFiles } from "@/lib/s3Func";
import Category from "@/models/category";
import { partition, endsWith, fromPairs, keys } from "lodash";

export const handleFormData = async (formData, Model, id) => {
  const obj = {
    image: [],
    video: [],
    banner: [],
    category: [],
    campaign: [],
    variant: [],
    tag: [],
  };
  const imagesToUpload = [];
  const videosToUpload = [];
  const bannerToUpload = [];
  const variantsFilesToUpload = [];
  const filesToDelete = [];
  let existingProd;

  validateFormData(formData);

  processFormEntries(
    formData,
    obj,
    imagesToUpload,
    videosToUpload,
    bannerToUpload,
    variantsFilesToUpload,
  );

  if (Model && id) {
    existingProd = await findExistingProduct(Model, id);
  }

  if (existingProd) {
    await handleExistingFiles(existingProd, obj, filesToDelete);
  }

  const uploadedImageNames = await uploadNewFiles(imagesToUpload, "image");
  const uploadedVideoNames = await uploadNewFiles(videosToUpload, "video");
  const uploadedBannerNames = await uploadNewFiles(bannerToUpload, "banner");

  updateObjWithUploadedFiles(obj, uploadedImageNames, "image");
  updateObjWithUploadedFiles(obj, uploadedVideoNames, "video");
  updateObjWithUploadedFiles(obj, uploadedBannerNames, "banner");

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
  const banners = formData.getAll("banner");

  if (status === "active") {
    if (!formData.get("category")) {
      throw new AppError("Category is required", 400);
    }
    if (images.length === 0 && videos.length === 0 && banners.length === 0) {
      throw new AppError("Please upload image, video, or banner", 400);
    }
  }
}

function processFormEntries(
  formData,
  obj,
  imagesToUpload,
  videosToUpload,
  bannerToUpload,
  variantsFilesToUpload,
) {
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("variantData")) {
      processVariantData(obj, key, value);
    } else if (key.startsWith("variantImage")) {
      processVariantImage(obj, variantsFilesToUpload, key, value);
    } else if (key === "category") {
      obj.category.push(value);
    } else if (key === "campaign") {
      obj.campaign.push(value);
    } else if (key === "image") {
      processMediaFile(obj, imagesToUpload, key, value);
    } else if (key === "tag") {
      obj.tag.push(value);
    } else if (key === "video") {
      processMediaFile(obj, videosToUpload, key, value);
    } else if (key === "banner") {
      processMediaFile(obj, bannerToUpload, key, value);
    } else {
      obj[key] = value;
    }
  }
}

function processVariantData(obj, key, value) {
  const index = key.match(/\d+/)[0];
  const data = JSON.parse(value);

  const options = data.options;
  const labelEntries = Object.entries(data).filter(([key]) =>
    key.endsWith("_label"),
  );

  const optionType = labelEntries.map(([key, value]) => ({
    labelId: value,
    label: key.replace("_label", ""),
  }));

  obj.variant[index] = {
    ...obj.variant[index],
    options,
    optionType,
    ...data,
  };
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
  const bannersToDelete = existingProd.banner
    ? existingProd.banner.filter((ban) => !obj.banner.includes(ban))
    : [];

  filesToDelete.push(...imagesToDelete, ...videosToDelete, ...bannersToDelete);

  if (filesToDelete.length > 0) {
    await deleteFiles(filesToDelete);
  }
}

async function uploadNewFiles(filesToUpload, fileType) {
  const files =
    filesToUpload.length > 0 ? await uploadFiles(filesToUpload, fileType) : [];

  return files;
}

function updateObjWithUploadedFiles(obj, uploadedFileNames, fileType) {
  obj[fileType].push(...uploadedFileNames);
}

async function handleVariantImages(obj, variantsFilesToUpload) {
  const variantImages = await Promise.all(
    variantsFilesToUpload.map(async (file) => {
      if (file.size > 0) {
        return await uploadFiles([file], "variant");
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
