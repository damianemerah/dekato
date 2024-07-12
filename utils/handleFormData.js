import AppError from "@/utils/errorClass";
import { uploadFiles, deleteFiles } from "@/utils/s3Func";

//Model here is designed to be only Product model
export const handleFormData = async (formData, Model, id) => {
  const obj = {};
  obj.image = [];
  obj.video = [];
  const files = [];
  const fileDelete = [];
  let existingProd;

  const images = formData.getAll("image");
  const videos = formData.getAll("video");
  const data = formData.get("data");

  console.log(data, "data⭐⭐");

  files.push(...images, ...videos);

  //parse data
  if (data) {
    const jsonData = JSON.parse(data);
    for (const [key, value] of Object.entries(jsonData)) {
      obj[key] = value;
    }
  }

  //check if image is uploaded
  if (!formData.has("image") && obj.image.length === 0) {
    throw new AppError("Please upload image", 400);
  }

  // check if model and id is provided & get existing product
  if (Model && id) {
    existingProd = await Model.findById(id);
    console.log(existingProd, id, "existingProd🚀🚀🚀");

    if (!existingProd) {
      throw new AppError("Product not found", 404);
    }
  }

  //delete existing files
  if (existingProd) {
    const images = existingProd.image.filter((img) => !obj.image.includes(img));
    const videos = existingProd.video
      ? existingProd.video.filter((vid) => !obj.video.includes(vid))
      : [];

    fileDelete.push(...images, ...videos);

    if (fileDelete.length > 0) {
      await deleteFiles(fileDelete);
    }
  }

  //upload files to s3
  console.log(files, "filesss🔥🔥🔥");

  const fileNames = files.length > 0 ? await uploadFiles(files) : [];

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
