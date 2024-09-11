"use client";

import { useState, useRef, memo, useEffect, useCallback } from "react";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import { createCategory, updateCategory } from "@/app/action/categoryAction";
import { ButtonPrimary } from "@/app/ui/button";
import { message } from "antd";
import { useCategoryStore } from "@/app/(frontend)/admin/store/adminStore";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import DropDown from "@/app/(frontend)/admin/ui/DropDown2";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/app/action/categoryAction";
import useSWR from "swr";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default memo(function NewCollection({ params }) {
  const slug = params.slug;
  const [fileList, setFileList] = useState([]);
  const [cParent, setCParent] = useState(null);
  const [actionType, setActionType] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [catList, setCatList] = useState([]);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const { data: allCategories, isLoading } = useSWR(
    "/api/allCategories",
    getAllCategories,
    {
      revalidateOnFocus: false,
    },
  );
  const setAllCategories = useCategoryStore((state) => state.setAllCategories);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (allCategories.length) {
      const category = allCategories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));

      setCatList(category);
    }
    if (slug !== "new" && allCategories.length) {
      const selectedCategory = allCategories.find(
        (category) => category.slug === slug,
      );

      console.log("selectedCategory", selectedCategory);

      if (selectedCategory) {
        setActionType("edit");

        selectedCategory.parent && setCParent(selectedCategory?.parent.id);
        const seletedImgs = selectedCategory.image.map((img, index) => {
          return {
            uid: index,
            name: "image.png",
            status: "done",
            url: img,
          };
        });
        setDefaultFileList(seletedImgs);

        titleRef.current.value = selectedCategory?.name;
        descriptionRef.current.value = selectedCategory?.description;
      } else {
        window.location.href = "/admin/collections";
      }
    } else if (slug === "new") {
      setActionType("create");
      setCParent(null);
    }
  }, [slug, allCategories, isLoading]);

  // Handle form submission
  const handleCreateCategory = async (formData, type) => {
    try {
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

      if (type === "edit") {
        const id = allCategories.find((category) => category.slug === slug).id;
        formData.append("id", id);

        for (const pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        const updatedCategory = await updateCategory(formData);

        message.success("Category updated");
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        setAllCategories(
          allCategories.map((category) =>
            category.slug === slug ? updatedCategory : category,
          ),
        );
        router.push(`/admin/collections/${updatedCategory.slug}`);
        return;
      }

      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const newCategory = await createCategory(formData);
      router.push(`/admin/collections/${newCategory.slug}`);

      message.success("Category created");
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      setAllCategories([...allCategories, newCategory]);
      setFileList([]);
    } catch (error) {
      message.error(error.message);
    }
  };

  if (!allCategories)
    return (
      <Spin
        indicator={<LoadingOutlined spin className="!text-primary" />}
        size="large"
        fullscreen
      />
    );

  return (
    <form
      action={(formData) => handleCreateCategory(formData, actionType)}
      className="px-10 py-20"
    >
      <ButtonPrimary
        type="submit"
        className="mb-4 ml-auto block !rounded-md !px-3.5 py-4 text-right text-base font-bold tracking-wide"
      >
        {actionType === "edit" ? "Update collection" : "Create collection"}
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
            <h4 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
              Parent Category
            </h4>
            <DropDown
              options={catList}
              selectedKeys={[cParent]}
              handleChange={(value) => setCParent(value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
});
