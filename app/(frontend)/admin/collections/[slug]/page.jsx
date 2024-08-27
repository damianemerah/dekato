"use client";

import { useState, useRef, memo, useEffect, useCallback } from "react";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import { createCategory, updateCategory } from "@/app/action/categoryAction";
import { ButtonPrimary } from "@/app/ui/button";
import { toast } from "react-toastify";
import DropDownSelect from "@/app/(frontend)/admin/ui/DropDown";
import { useCategoryStore } from "@/app/(frontend)/admin/store/adminStore";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";

export default memo(function NewCollection({ params }) {
  const slug = params.slug;
  const [fileList, setFileList] = useState([]);
  const [showCatOptions, setShowCatOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [actionType, setActionType] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const allCategories = useCategoryStore((state) => state.allCategories);
  const setAllCategories = useCategoryStore((state) => state.setAllCategories);

  useEffect(() => {
    if (slug !== "new" && allCategories.length > 0) {
      const selectedCategory = allCategories.find(
        (category) => category.slug === slug,
      );
      if (selectedCategory) {
        setActionType("edit");

        setSelectedOption(selectedCategory?.slug);
        setDefaultFileList([
          {
            uid: selectedCategory?.id,
            name: "image.png",
            status: "done",
            url: selectedCategory.image[0],
          },
        ]);

        titleRef.current.value = selectedCategory?.name;
        descriptionRef.current.value = selectedCategory?.description;
      }
    } else if (slug === "new") {
      setActionType("create");
      setSelectedOption(null);
    } else {
      window.location.href = "/admin/collections";
    }
  }, [slug, allCategories]);

  // Handle form submission
  const handleCreateCategory = async (formData, type) => {
    try {
      const medias = getFiles(fileList);
      console.log(medias);
      medias.images.forEach((file) => {
        formData.append("image", file);
      });
      medias.videos.forEach((file) => {
        formData.append("video", file);
      });

      if (type === "edit") {
        const id = allCategories.find(
          (category) => category.slug === selectedOption,
        ).id;
        formData.append("id", id);

        const updatedCategory = await updateCategory(formData);

        toast.success("Category updated");
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        setAllCategories(
          allCategories.map((category) =>
            category.slug === selectedOption ? updatedCategory : category,
          ),
        );
        return;
      }

      const newCategory = await createCategory(formData);
      toast.success("Category created");
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      setAllCategories([...allCategories, newCategory]);
      setFileList([]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!allCategories) return <div>Loading...</div>;

  return (
    <form
      action={(formData) => handleCreateCategory(formData, actionType)}
      className="px-10 py-20"
    >
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
          <div className="mb-6 rounded-lg bg-white p-6 shadow-shadowSm">
            <MediaUpload
              multiple={false}
              fileList={fileList}
              setFileList={setFileList}
              defaultFileList={defaultFileList}
            />
          </div>
          <DropDownSelect
            showOptions={showCatOptions}
            options={allCategories || []}
            className="bg-white"
            variationName="parent"
            selectedVariantVal={selectedOption}
            onClick={() => {
              setShowCatOptions(!showCatOptions);
            }}
            handleSelectedOption={(option, name) => {
              setSelectedOption(option.slug);
            }}
          />
        </div>
      </div>
    </form>
  );
});
