import Image from "next/image";
import { useState, useRef } from "react";
import MediaUploadIcon from "@/public/assets/icons/media.svg";

import AddIcon from "@/public/assets/icons/add.svg";

const MediaUpload = ({ onFilesChange, selectBtn, handleExistingFile }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    onFilesChange([...selectedFiles, ...files]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);

    // Remove the file from the input element
    const dt = new DataTransfer();
    updatedFiles.forEach((file) => dt.items.add(file));
    fileInputRef.current.files = dt.files;
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
          MEDIA
        </h3>
        <div className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-grayOutline p-8 text-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleButtonClick}
              className="flex items-center gap-1 rounded-md border border-grayOutline px-4 py-1 opacity-70 shadow-shadowSm"
            >
              <MediaUploadIcon className="h-4 w-4" />
              Add files
            </button>
            {selectBtn && (
              <button
                type="button"
                className="rounded-md border border-grayOutline px-4 py-1 opacity-70 shadow-shadowSm"
                onClick={handleExistingFile}
              >
                Choose existing
              </button>
            )}
          </div>
          <span className="opacity-50">Accepts images, videos</span>
          <input
            type="file"
            name="media"
            hidden
            multiple
            accept="image/*, video/*"
            autoComplete="off"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        <div>
          {selectedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative flex h-24 w-auto items-center justify-center overflow-hidden rounded-md border border-gray-300"
                >
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                      draggable="true"
                      width={100}
                      height={100}
                    />
                  ) : file.type.startsWith("video/") ? (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">{file.name}</span>
                  )}

                  <AddIcon
                    className="absolute right-1 top-1 h-4 w-4 rotate-45 transform rounded-full bg-red-500 p-1 text-base font-extrabold text-white"
                    onClick={() => {
                      handleDelete(index);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
