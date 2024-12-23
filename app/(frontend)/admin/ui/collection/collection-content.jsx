"use client";

import { useState, useRef, memo, useEffect } from "react";
import {
  createCollection,
  updateCollection,
  getAllCollections,
} from "@/app/action/collectionAction";
import { ButtonPrimary } from "@/app/ui/button";
import { message } from "antd";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import useSWR, { mutate } from "swr";
import { SmallSpinner } from "@/app/ui/spinner";
import Link from "next/link";
import { getAllCategories } from "@/app/action/categoryAction";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const DropDown = dynamic(() => import("@/app/(frontend)/admin/ui/DropDown"), {
  ssr: false,
});

const MediaUpload = dynamic(
  () => import("@/app/(frontend)/admin/ui/MediaUpload"),
  {
    ssr: false,
  },
);

const Checkbox = dynamic(() => import("antd").then((mod) => mod.Checkbox), {
  ssr: false,
});

export default memo(function CollectionContent({ collectionId, collection }) {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [bannerFileList, setBannerFileList] = useState([]);
  const [actionType, setActionType] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [defaultBannerFileList, setDefaultBannerFileList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [selectedCatKeys, setSelectedCatKeys] = useState([]);
  const [isSale, setIsSale] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const router = useRouter();

  const { data: allCollections, isLoading } = useSWR(
    "/api/allCollections",
    getAllCollections,
    {
      revalidateOnFocus: false,
      fallbackData: collection,
    },
  );

  const { data: allCategories, isLoading: catIsLoading } = useSWR(
    "/api/allCategories",
    () => getAllCategories({ limit: 100 }),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (!catIsLoading && allCategories?.data.length) {
      setCatList(
        allCategories?.data
          .sort((a, b) => {
            if (a.parent === null && b.parent !== null) return -1;
            if (a.parent !== null && b.parent === null) return 1;
            return 0;
          })
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
          })),
      );
    }
  }, [allCategories?.data, catIsLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (collectionId !== "new" && allCollections?.data?.length) {
      const selectedCollection = allCollections?.data.find(
        (collection) => collection.id === collectionId,
      );

      if (selectedCollection) {
        setActionType("edit");
        setSelectedCollection(selectedCollection);
        setSelectedCatKeys(
          selectedCollection.category ? [selectedCollection.category.id] : [],
        );
        setIsSale(selectedCollection.isSale || false);
      } else {
        window.location.href = "/admin/collections";
      }
    } else if (collectionId === "new") {
      setActionType("create");
    }
  }, [allCollections, isLoading, collectionId]);

  useEffect(() => {
    if (selectedCollection) {
      const selectedImgs = selectedCollection.image.map((img, index) => ({
        uid: index,
        name: "image.png",
        status: "done",
        url: img,
      }));
      setDefaultFileList(selectedImgs);

      const selectedBanners =
        selectedCollection.banner?.map((banner, index) => ({
          uid: index,
          name: "banner.png",
          status: "done",
          url: banner,
        })) || [];
      setDefaultBannerFileList(selectedBanners);

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

      const bannerMedias = getFiles(bannerFileList);
      bannerMedias.images.forEach((file) => {
        formData.append("banner", file);
      });

      if (selectedCatKeys.length > 0) {
        formData.append("category", selectedCatKeys[0]);
      }

      formData.append("isSale", isSale);

      if (type === "edit") {
        const id = allCollections?.data.find(
          (collection) => collection.id === collectionId,
        ).id;
        formData.append("id", id);

        await updateCollection(formData);

        message.success("Collection updated");
        titleRef.current.value = "";
        descriptionRef.current.value = "";
        return;
      }

      const newCollection = await createCollection(formData);
      router.push(`/admin/collections/${newCollection.id}`);

      mutate("/api/allCollections");
      message.success("Collection created");
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      setFileList([]);
      setBannerFileList([]);
      setSelectedCatKeys([]);
      setIsSale(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );

  if (!allCollections || !allCategories?.data) return <LoadingSpinner />;

  return (
    <form
      action={(formData) => handleCreateCollection(formData, actionType)}
      className="px-10 py-20"
    >
      <div className="mb-4 flex justify-between">
        {actionType !== "create" && (
          <Link href="/admin/collections/new" passHref>
            <ButtonPrimary className="!rounded-md bg-secondary px-2 text-base font-bold tracking-wide text-white">
              New Collection
            </ButtonPrimary>
          </Link>
        )}
        <ButtonPrimary
          type="submit"
          loading={isLoading}
          className={`!rounded-md bg-primary px-2 text-right text-base font-bold tracking-wide text-white ${
            actionType === "create" ? "ml-auto" : ""
          }`}
        >
          {actionType === "edit" ? "Update collection" : "Create collection"}
        </ButtonPrimary>
      </div>
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
          <div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-shadowSm">
              <h4 className="mb-1 block text-xxs font-bold uppercase tracking-[0.12em] text-primary">
                Images
              </h4>
              <MediaUpload
                multiple={true}
                fileList={fileList}
                setFileList={setFileList}
                defaultFileList={defaultFileList}
                setDefaultFileList={setDefaultFileList}
              />
            </div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-shadowSm">
              <h4 className="mb-1 block text-xxs font-bold uppercase tracking-[0.12em] text-primary">
                Banner
              </h4>
              <MediaUpload
                multiple={true}
                fileList={bannerFileList}
                setFileList={setBannerFileList}
                defaultFileList={defaultBannerFileList}
                setDefaultFileList={setDefaultBannerFileList}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
            <h4 className="mb-1 block text-xxs font-bold uppercase tracking-[0.12em] text-primary">
              Category
            </h4>
            <DropDown
              options={catList}
              selectedKeys={selectedCatKeys}
              handleChange={(value) => setSelectedCatKeys([value])}
              placeholder="Select a category"
            />
          </div>
          <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
            <h4 className="mb-1 block text-xxs font-bold uppercase tracking-[0.12em] text-primary">
              Sale Collection
            </h4>
            <Checkbox
              checked={isSale}
              onChange={(e) => setIsSale(e.target.checked)}
            >
              Is this a sale collection?
            </Checkbox>
          </div>
        </div>
      </div>
    </form>
  );
});
