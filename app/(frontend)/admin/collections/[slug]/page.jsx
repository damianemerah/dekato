"use client";

import { useState, useRef, memo, useEffect } from "react";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import {
  createCollection,
  updateCollection,
  getAllCollections,
} from "@/app/action/collectionAction";
import { ButtonPrimary } from "@/app/ui/button";
import { message } from "antd";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { BigSpinner } from "@/app/ui/spinner";

export default memo(function NewCollection({ params }) {
  const slug = params.slug;
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [actionType, setActionType] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const { data: allCollections, isLoading } = useSWR(
    "/api/allCollections",
    getAllCollections,
    {
      revalidateOnFocus: false,
    },
  );

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (slug !== "new" && allCollections?.length) {
      const selectedCollection = allCollections.find(
        (collection) => collection.slug === slug,
      );

      if (selectedCollection) {
        setActionType("edit");
        setSelectedCollection(selectedCollection);
      } else {
        window.location.href = "/admin/collections";
      }
    } else if (slug === "new") {
      setActionType("create");
    }
  }, [allCollections, isLoading, slug]);

  useEffect(() => {
    if (selectedCollection) {
      const selectedImgs = selectedCollection.image.map((img, index) => ({
        uid: index,
        name: "image.png",
        status: "done",
        url: img,
      }));
      setDefaultFileList(selectedImgs);

      if (titleRef.current) titleRef.current.value = selectedCollection?.name;
      if (descriptionRef.current)
        descriptionRef.current.value = selectedCollection?.description || "";
    }
  }, [selectedCollection]);

  // Handle form submission
  const handleCreateCollection = async (formData, type) => {
    try {
      const medias = getFiles(fileList);
      medias.images.forEach((file) => {
        formData.append("image", file);
      });

      if (type === "edit") {
        const id = allCollections.find(
          (collection) => collection.slug === slug,
        ).id;
        formData.append("id", id);

        await updateCollection(formData);

        message.success("Collection updated");
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        return;
      }

      await createCollection(formData);

      mutate("/api/allCollections");
      message.success("Collection created");
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      setFileList([]);
    } catch (error) {
      message.error(error.message);
    }
  };

  if (!allCollections) return <BigSpinner />;

  return (
    <form
      action={(formData) => handleCreateCollection(formData, actionType)}
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
              placeholder="Summer Collection"
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
              placeholder="A collection of summer-themed products."
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
        </div>
      </div>
    </form>
  );
});
