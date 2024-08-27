import Image from "next/image";
import {
  useState,
  useRef,
  memo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import MediaUploadIcon from "@/public/assets/icons/media.svg";
import AddIcon from "@/public/assets/icons/add.svg";
import { useCategoryStore } from "../../store/adminStore";

const defaultAccept = "image/*, video/*";

const MediaUpload = forwardRef(
  (
    {
      onFilesChange,
      selectBtn,
      handleExistingFile,
      multiple = true,
      varImg,
      accept = defaultAccept,
    },
    ref,
  ) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const initialFiles = useCategoryStore((state) => state.initialFiles);
    const setInitialFiles = useCategoryStore((state) => state.setInitialFiles);

    const handleFileChange = useCallback(
      (event) => {
        const files = Array.from(event.target.files);
        const filesWithPreview = files.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        if (multiple) {
          setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
          onFilesChange(
            [...selectedFiles, ...filesWithPreview].map((f) => f.file),
          );
        } else {
          selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
          setSelectedFiles(filesWithPreview);
          onFilesChange(filesWithPreview.map((f) => f.file));
        }
      },
      [multiple, selectedFiles, onFilesChange],
    );

    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleDelete = useCallback(
      (index) => {
        const fileToRemove = selectedFiles[index];

        if (fileToRemove.isInitial) {
          const updatedFile = {
            ...fileToRemove,
            isDeleted: true,
            preview: null,
          };

          const updatedInitialFiles = initialFiles.map((file) =>
            file === fileToRemove ? updatedFile : file,
          );

          const updatedSelectedFiles = selectedFiles.filter(
            (_, i) => i !== index,
          );

          setInitialFiles(updatedInitialFiles);
          setSelectedFiles(updatedSelectedFiles);
          // onFilesChange(updatedSelectedFiles.map((f) => f.file));
        } else {
          const updatedFiles = selectedFiles.filter((_, i) => i !== index);
          URL.revokeObjectURL(fileToRemove.preview);
          setSelectedFiles(updatedFiles);
          // onFilesChange(updatedFiles.map((f) => f.file));
        }

        const dt = new DataTransfer();
        selectedFiles
          .filter((_, i) => i !== index)
          .forEach(({ file }) => dt.items.add(file));

        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
      },
      [selectedFiles, onFilesChange, setInitialFiles, initialFiles],
    );

    // Fixing useEffect to ensure correct handling of deleted files
    useEffect(() => {
      if (!multiple && initialFiles?.length > 0) {
        const filesWithPreview = initialFiles
          .filter((file) => !file.isDeleted) // Only include files that are not deleted
          .map((file) => ({
            ...file,
            preview: file.preview || URL.createObjectURL(file.file),
            isInitial: true,
          }));

        setSelectedFiles(filesWithPreview);
      }
    }, [initialFiles, multiple]);

    useEffect(() => {
      return () => {
        selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
      };
    }, [selectedFiles]);

    useImperativeHandle(ref, () => ({
      clearFiles: () => {
        selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
        setSelectedFiles([]);
        onFilesChange([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    }));

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
              name={varImg || "media"}
              hidden
              multiple={multiple}
              accept={accept}
              autoComplete="off"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <div>
            {selectedFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFiles.map(({ file, preview }, index) => (
                  <div
                    key={index}
                    className="relative flex h-24 w-auto items-center justify-center overflow-hidden rounded-md border border-gray-300"
                  >
                    {file?.type.startsWith("image/") || preview ? (
                      <Image
                        src={preview}
                        alt={file?.name || "image preview"}
                        className="h-full w-full object-cover"
                        draggable="true"
                        width={100}
                        height={100}
                      />
                    ) : file.type.startsWith("video/") ? (
                      <video
                        src={preview}
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
  },
);

MediaUpload.displayName = "MediaUpload";
export default memo(MediaUpload);
