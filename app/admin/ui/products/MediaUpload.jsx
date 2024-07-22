import Image from "next/image";
import { useState, useRef } from "react";
import addIcon from "@/public/assets/icons/add.svg";

const MediaUpload = ({ onFilesChange }) => {
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
        <h3 className="text-xxs mb-1 block font-bold tracking-wider text-primary">
          MEDIA
        </h3>
        <label className="flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-grayOutline text-sm">
          <button
            type="button"
            onClick={handleButtonClick}
            className="shadow-shadowSm rounded-md border border-grayOutline px-4 py-1 opacity-70"
          >
            {selectedFiles.length > 0 ? "Add more files" : "Add files"}
          </button>
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
        </label>
        <div>
          {selectedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative flex h-24 w-auto items-center justify-center overflow-hidden rounded-md border border-gray-300"
                >
                  {file.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                      draggable="true"
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

                  <Image
                    src={addIcon}
                    onClick={() => handleDelete(index)}
                    width={20}
                    height={20}
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                    alt="Add icon"
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
