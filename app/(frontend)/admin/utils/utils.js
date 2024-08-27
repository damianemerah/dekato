// export function disambiguateLabel(key, value) {
//   switch (key) {
//     case "type":
//       return value.map((val) => `type: ${val}`).join(", ");
//     case "tone":
//       return value.map((val) => `tone: ${val}`).join(", ");
//     default:
//       return value;
//   }
// }

// export function isEmpty(value) {
//   if (Array.isArray(value)) {
//     return value.length === 0;
//   } else {
//     return value === "" || value == null;
//   }
// }

export function getFiles(fileList) {
  const media = {
    images: [],
    videos: [],
  };

  // Define image and video extensions for strings
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
  const videoExtensions = /\.(mp4|avi|mov|mkv|webm|flv|wmv)$/i;

  console.log(fileList);

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
