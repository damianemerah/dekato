"use client";

import { useState, useRef, memo } from "react";
import ImageUpload from "@/app/admin/ui/products/MediaUpload";
import { createCategory, getAllCategories } from "@/app/action/categoryAction";
import { ButtonPrimary } from "@/app/ui/button";
import { toast } from "react-toastify";
import DropDownSelect from "@/app/admin/ui/DropDown";
import { useCategoryStore } from "@/store/store";
import useSWR from "swr";

export default memo(function NewCollection() {
  const [files, setFiles] = useState([]);
  const [showCatOptions, setShowCatOptions] = useState(false);

  const fileInputRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const setAllCategories = useCategoryStore((state) => state.setAllCategories);
  const allCategories = useCategoryStore((state) => state.allCategories);

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  // Use SWR to fetch categories
  const { mutate: refetchCategories } = useSWR(
    "/api/allcategories",
    getAllCategories,
    {
      revalidateOnFocus: false,
      onSuccess: (fetchedData) => {
        setAllCategories(fetchedData);
      },
    },
  );

  const handleClearFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.clearFiles();
    }
    titleRef.current.value = "";
    descriptionRef.current.value = "";
  };

  // Handle form submission
  const handleCreateCategory = async (formData) => {
    try {
      const newCategory = await createCategory(formData);
      toast.success("Category created");
      setAllCategories(newCategory);
      handleClearFiles();
      await refetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form action={handleCreateCategory} className="px-10 py-20">
      <ButtonPrimary
        type="submit"
        className="mb-4 ml-auto block !rounded-md !px-3.5 py-4 text-right text-base font-bold tracking-wide"
      >
        Create Collection
      </ButtonPrimary>
      <div className="mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm lg:col-span-2">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary"
            >
              TITLE
            </label>
            <input
              ref={titleRef}
              type="text"
              name="name"
              required
              id="title"
              autoComplete="off"
              placeholder="Short sleeve t-shirt"
              className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary"
            >
              DESCRIPTION
            </label>
            <textarea
              ref={descriptionRef}
              name="description"
              id="description"
              placeholder="A short sleeve t-shirt made from organic cotton."
              className="block h-28 w-full resize-none rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
            ></textarea>
          </div>
        </div>
        <div>
          <ImageUpload
            ref={fileInputRef}
            onFilesChange={handleFilesChange}
            accept="image/*"
            multiple={false}
          />
          <DropDownSelect
            required={true}
            showOptions={showCatOptions}
            options={allCategories || []}
            className="bg-white"
            variationName="parent"
            selectedVariantVal="Selected Variant"
            onClick={() => {
              setShowCatOptions(!showCatOptions);
            }}
            handleSelectedOption={(option, name) => {
              console.log(option, name, "Selected Option");
              return;
            }}
          />
        </div>
      </div>
    </form>
  );
});
