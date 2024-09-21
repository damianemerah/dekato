export function getFiles(fileList) {
  const media = {
    images: [],
    videos: [],
  };

  // Define image and video extensions for strings
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
  const videoExtensions = /\.(mp4|avi|mov|mkv|webm|flv|wmv)$/i;


  fileList.forEach((item) => {
    // Check if the item is a File object or a string
    if (item.url && typeof item.url === "string") {
      if (imageExtensions.test(item.url)) {
        media.images.push(item.url);
      } else if (videoExtensions.test(item.url)) {
        media.videos.push(item.url);
      }
    } else if (item.type) {
      // Check File object by its type property
      if (item.type.startsWith("image/")) {
        media.images.push(item.originFileObj);
      } else if (item.type.startsWith("video/")) {
        media.videos.push(item.originFileObj);
      }
    }
  });

  return media;
}

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
