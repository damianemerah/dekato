"use client";

import { useState, useRef, useEffect } from "react";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import { createCategory, updateCategory } from "@/app/action/categoryAction";
import { ButtonPrimary } from "@/app/ui/button";
import { Checkbox, message } from "antd";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import DropDown from "@/app/(frontend)/admin/ui/DropDown";
import { getAllCategories } from "@/app/action/categoryAction";
import useSWR, { mutate } from "swr";
import { SmallSpinner } from "@/app/ui/spinner";

export default function NewCategory({ slug }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [cParent, setCParent] = useState(null);
  const [actionType, setActionType] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [isPinned, setIsPinned] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const pinnedRef = useRef(null);

  const { data: allCategories, isLoading } = useSWR(
    "/api/allCategories",
    () => getAllCategories({ limit: 100 }),
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (isLoading) return;
    if (allCategories?.data?.length > 0) {
      const category = allCategories?.data
        .map((cat) => ({
          value: cat.id,
          label: (
            <p>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}{" "}
              {cat.parent?.name
                ? `(${cat.parent.name.charAt(0).toUpperCase() + cat.parent.name.slice(1)})`
                : ""}
            </p>
          ),
          parent: cat.parent,
          disabled: cat.parent !== null,
        }))
        .sort((a, b) => a.disabled - b.disabled);

      setCatList(category);
    }
    if (slug !== "new" && allCategories?.data.length) {
      const selectedCategory = allCategories?.data.find(
        (category) => category.slug === slug,
      );

      if (selectedCategory) {
        setActionType("edit");
        setSelectedCategory(selectedCategory);
        setIsPinned(selectedCategory.pinned || false);
      } else {
        window.location.href = "/admin/categories";
      }
    } else if (slug === "new") {
      setActionType("create");
      setCParent(null);
      setIsPinned(false);
    }
  }, [allCategories?.data, isLoading, slug]);

  useEffect(() => {
    if (selectedCategory) {
      selectedCategory.parent && setCParent(selectedCategory?.parent.id);
      const selectedImgs = selectedCategory.image.map((img, index) => {
        return {
          uid: index,
          name: "image.png",
          status: "done",
          url: img,
        };
      });
      setDefaultFileList(selectedImgs);

      if (titleRef.current) titleRef.current.value = selectedCategory?.name;
      if (descriptionRef.current)
        descriptionRef.current.value = selectedCategory?.description || "";
      if (pinnedRef.current)
        pinnedRef.current.checked = selectedCategory?.pinned;
      setIsPinned(selectedCategory?.pinned || false);
    }
  }, [selectedCategory]);

  // Handle form submission
  const handleCreateCategory = async (formData, type) => {
    try {
      if (formData.get("pinned") === "true") {
        formData.set("pinned", true);
      } else {
        formData.set("pinned", false);
      }
      const medias = getFiles(fileList);
      medias.images.forEach((file) => {
        formData.append("image", file);
      });
      medias.videos.forEach((file) => {
        formData.append("video", file);
      });

      if (cParent?.length > 0) {
        formData.append("parent", cParent);
      }

      // Ensure top-level categories cannot be pinned
      if (!cParent) {
        formData.set("pinned", false);
      }

      // Check the number of pinned categories under the selected parent
      const parentCategory = allCategories?.data.find(
        (cat) => cat.id === cParent,
      );
      console.log(parentCategory, "parentCategory");
      const pinnedCount = allCategories?.data.filter(
        (cat) => cat.parent?.id === cParent && cat.pinned,
      ).length;
      const isAlreadyPinned = selectedCategory?.pinned;
      if (pinnedCount >= 5 && !isAlreadyPinned) {
        message.error(
          `Cannot pin more than 5 categories under ${parentCategory.name}`,
        );
        return;
      }

      if (type === "edit") {
        const id = allCategories?.data.find(
          (category) => category.slug === slug,
        ).id;
        formData.append("id", id);

        // Prevent category from using itself as a parent
        if (cParent === id) {
          message.warning("A category cannot be its own parent.");
          return;
        }

        const updatedCategory = await updateCategory(formData);

        message.success("Category updated");
        titleRef.current.value = "";
        descriptionRef.current.value = "";

        return;
      }

      const newCategory = await createCategory(formData);

      mutate("/api/allCategories");
      message.success("Category created");
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      setFileList([]);
    } catch (error) {
      message.error(error.message);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );

  if (!allCategories?.data) return <LoadingSpinner />;

  return (
    <form
      action={(formData) => handleCreateCategory(formData, actionType)}
      className="px-10 py-20"
    >
      <ButtonPrimary
        type="submit"
        loading={isLoading}
        className={`mb-4 ml-auto block !rounded-md bg-primary px-2 text-right text-base font-bold tracking-wide text-white`}
      >
        {actionType === "edit" ? "Update category" : "Create category"}
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
              setDefaultFileList={setDefaultFileList}
            />
          </div>

          <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
            <div
              className={`${!cParent ? "hidden" : ""} mb-4 flex items-center gap-2`}
            >
              <h4
                className="block text-xxs font-bold leading-none tracking-[0.12em] text-primary"
                title="Pinned categories can be featured on the homepage"
              >
                PINNED
              </h4>

              <Checkbox
                ref={pinnedRef}
                name="pinned"
                value="true"
                checked={isPinned}
                onChange={() => setIsPinned(!isPinned)}
              />
            </div>
            <h4 className="mb-1 block text-xxs font-bold uppercase tracking-[0.12em] text-primary">
              Parent Category
            </h4>
            <DropDown
              options={catList}
              selectedKeys={[cParent]}
              handleChange={(value) => {
                if (value === selectedCategory?.id) {
                  message.warning("A category cannot be its own parent.");
                  return;
                }
                setCParent(value);
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
