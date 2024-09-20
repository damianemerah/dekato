"use client";

import { useState, useRef, memo, useEffect, useCallback } from "react";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import { createCategory, updateCategory } from "@/app/action/categoryAction";
import { ButtonPrimary } from "@/app/ui/button";
import { Checkbox, InputNumber, message } from "antd";
import { useCategoryStore } from "@/app/(frontend)/admin/store/adminStore";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import DropDown from "@/app/(frontend)/admin/ui/DropDown2";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/app/action/categoryAction";
import useSWRImmutable from "swr/immutable";
import { Spin, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { oswald } from "@/style/font";
import useSWR from "swr";

export default memo(function NewCollection({ params }) {
  const slug = params.slug;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [cParent, setCParent] = useState(null);
  const [actionType, setActionType] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [pinOrder, setPinOrder] = useState(0);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const pinnedRef = useRef(null);
  const pinOrderRef = useRef(null);

  const { data: allCategories, isLoading } = useSWRImmutable(
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
    // Find the category with the highest pinOrder
    if (allCategories?.length > 0) {
      const highestPinOrder = allCategories.reduce((maxOrder, category) => {
        const pinOrder = category.pinOrder || 0;
        return pinOrder > maxOrder ? pinOrder : maxOrder;
      }, 0);

      setPinOrder(highestPinOrder + 1);

      // Filter categories to only include "men" or "women"
      const filteredCategories = allCategories.filter(
        (cat) =>
          cat.name.toLowerCase() === "men" ||
          cat.name.toLowerCase() === "women",
      );

      const category = filteredCategories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));

      setCatList(category);
    }
    if (slug !== "new" && allCategories.length) {
      const selectedCategory = allCategories.find(
        (category) => category.slug === slug,
      );


      if (selectedCategory) {
        setActionType("edit");

        setSelectedCategory(selectedCategory);
      } else {
        window.location.href = "/admin/collections";
      }
    } else if (slug === "new") {
      setActionType("create");
      setCParent(null);
    }
  }, [slug, allCategories, isLoading]);

  useEffect(() => {
    if (selectedCategory) {
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

      if (titleRef.current) titleRef.current.value = selectedCategory?.name;
      if (descriptionRef.current)
        descriptionRef.current.value = selectedCategory?.description;
      if (pinnedRef.current)
        pinnedRef.current.checked = selectedCategory?.pinned;
      setIsPinned(selectedCategory?.pinned || false);
      if (pinOrderRef.current)
        pinOrderRef.current.value = selectedCategory?.pinOrder || "";
      setPinOrder(selectedCategory?.pinOrder || 0);
    }
  }, [selectedCategory]);

  // Handle form submission
  const handleCreateCategory = async (formData, type) => {
    try {
      for (const pair of formData.entries()) {
      }
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

      // Ensure "men" and "women" cannot be pinned
      if (
        formData.get("name").toLowerCase() === "men" ||
        formData.get("name").toLowerCase() === "women"
      ) {
        formData.set("pinned", false);
      }

      // Check the number of pinned categories under the selected parent
      const parentCategory = allCategories.find((cat) => cat.id === cParent);
      const pinnedCount = allCategories.filter(
        (cat) => cat.parent?.id === cParent && cat.pinned,
      ).length;

      if (pinnedCount >= 5) {
        message.error(
          `Cannot pin more than 5 categories under ${parentCategory.name}`,
        );
        return;
      }

      if (type === "edit") {
        const id = allCategories.find((category) => category.slug === slug).id;
        formData.append("id", id);

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
        loading={isLoading}
        className={`mb-4 ml-auto block !rounded-md bg-primary px-2 text-right text-base font-bold tracking-wide text-white`}
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
              multiple={true}
              fileList={fileList}
              setFileList={setFileList}
              defaultFileList={defaultFileList}
              setDefaultFileList={setDefaultFileList}
            />
          </div>

          <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
            <div className="mb-4 flex items-center gap-2">
              <h4 className="block text-xxs font-bold leading-none tracking-[0.12em] text-primary">
                PINNED
              </h4>

              <Checkbox
                ref={pinnedRef}
                name="pinned"
                value="true"
                checked={isPinned}
                onChange={() => setIsPinned(!isPinned)}
                disabled={
                  selectedCategory?.name.toLowerCase() === "men" ||
                  selectedCategory?.name.toLowerCase() === "women"
                }
              />

              {isPinned && (
                <InputNumber
                  name="pinOrder"
                  value={pinOrder}
                  ref={pinOrderRef}
                  onChange={(value) => setPinOrder(value)}
                  className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
                />
              )}
            </div>
            <h4 className="mb-1 block text-xxs font-bold uppercase tracking-[0.12em] text-primary">
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
