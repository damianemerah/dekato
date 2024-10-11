"use client";

import { useState, memo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import { message } from "antd";
import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "@/app/action/productAction";
import { getAllCategories } from "@/app/action/categoryAction";
import { getAllCollections } from "@/app/action/collectionAction";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import { generateVariantOptions } from "@/utils/getFunc";
import useConfirmModal from "@/app/ui/confirm-modal";
import "react-quill/dist/quill.snow.css";
import { useUserStore } from "@/store/store";
import ProductForm from "@/app/(frontend)/admin/ui/products/productForm";

const Page = memo(function Page({ params }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const slug = params.slug;

  const [fileList, setFileList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [switchState, setSwitchState] = useState(false);
  const [selectedCatKeys, setSelectedCatKeys] = useState([]);
  const [selectedCollectionKeys, setSelectedCollectionKeys] = useState([]);
  const [openSlider1, setOpenSlider1] = useState(false);
  const [openSlider2, setOpenSlider2] = useState(false);
  const [actionType, setActionType] = useState("");
  const [status, setStatus] = useState("draft");
  const [prodLoading, setProdLoading] = useState(false);
  const [description, setDescription] = useState("");

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);
  const discountRef = useRef(null);
  const submitBtnRef = useRef(null);

  const showConfirmModal = useConfirmModal();

  const setEditVariantWithId = useAdminStore(
    (state) => state.setEditVariantWithId,
  );
  const variants = useAdminStore((state) => state.variants);
  const setVariants = useAdminStore((state) => state.setVariants);
  const setCurVariantOptions = useAdminStore(
    (state) => state.setCurVariantOptions,
  );

  const { data: allCategories, isLoading: catIsLoading } = useSWRImmutable(
    "/api/allCategories",
    getAllCategories,
    { revalidateOnFocus: false },
  );

  const { data: products, isLoading } = useSWR(
    `/admin/products/${slug}`,
    () => (slug !== "new" ? getProductById(slug) : null),
    {
      revalidateOnFocus: false,
      refreshInterval: 10000, // 10 seconds
    },
  );

  const { data: collections, isLoading: collectionIsLoading } = useSWRImmutable(
    "/api/allCollections",
    getAllCollections,
    { revalidateOnFocus: false },
  );

  const initializeEditMode = useCallback(
    (product) => {
      setActionType("edit");
      setVariants(product?.variant);
      setCurVariantOptions(generateVariantOptions(product?.variant));
      setDefaultFileList(
        product.image.map((img, index) => ({
          uid: index,
          name: "image.png",
          status: "done",
          url: img,
        })),
      );
      setSelectedCatKeys(product?.category?.map((cat) => cat.id) || []);
      setSelectedCollectionKeys(product?.campaign?.map((cat) => cat.id) || []);
      setDescription(product.description || "");
      nameRef.current.value = product.name || "";
      priceRef.current.value = product.price || "";
      quantityRef.current.value = product.quantity || "";
      discountRef.current.value = product?.discount || "";
    },
    [setCurVariantOptions, setVariants],
  );

  useEffect(() => {
    if (!catIsLoading && allCategories?.length) {
      setCatList(
        allCategories.map((cat) => ({
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
        })),
      );
    }
  }, [allCategories, catIsLoading]);

  useEffect(() => {
    if (!collectionIsLoading && collections?.length) {
      setCollectionList(
        collections.map((collection) => ({
          value: collection.id,
          label: (
            <p>
              {collection.name.charAt(0).toUpperCase() +
                collection.name.slice(1)}{" "}
              {collection.category?.name
                ? `(${collection.category.name.charAt(0).toUpperCase() + collection.category.name.slice(1)})`
                : ""}
            </p>
          ),
        })),
      );
    }
  }, [collections, collectionIsLoading]);

  useEffect(() => {
    if (isLoading) return;

    if (slug !== "new" && products) {
      initializeEditMode(products);
    } else if (slug === "new") {
      setActionType("create");
      setCurVariantOptions([]);
    } else {
      alert("Product not found");
      router.push("/admin/products");
    }
  }, [
    slug,
    products,
    isLoading,
    router,
    initializeEditMode,
    setCurVariantOptions,
  ]);

  const handleFormSubmit = async (formData) => {
    try {
      setProdLoading(true);
      formData.append("status", status);
      formData.append("description", description);

      const medias = getFiles(fileList);
      medias.images.forEach((file) => formData.append("image", file));
      medias.videos.forEach((file) => formData.append("video", file));

      variants.forEach((variant, index) => {
        const { id, imageURL, image, ...rest } = variant;
        if (!isUUID(id)) rest._id = id;
        formData.append(`variantData[${index}]`, JSON.stringify(rest));
        if (image?.originFileObj instanceof File) {
          formData.append(`variantImage[${index}]`, image.originFileObj);
        } else if (image && typeof image === "string") {
          formData.append(`variantImage[${index}]`, image);
        }
      });

      selectedCatKeys.forEach((catId) => formData.append("category", catId));
      selectedCollectionKeys.forEach((collectionId) =>
        formData.append("campaign", collectionId),
      );

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const action = actionType === "create" ? createProduct : updateProduct;
      if (actionType === "edit") formData.append("id", slug);

      const product = await action(formData);
      if (product.status === "error") throw new Error(product.message);

      mutate(`/admin/products/${product.id}`);
      mutate(`/cart/${user.id}`);
      message.success(
        `Product ${actionType === "create" ? "created" : "updated"}`,
      );
    } catch (err) {
      message.error(err.message);
    } finally {
      setSwitchState(false);
      setProdLoading(false);
    }
  };

  const isUUID = (id) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const showConfirm = () => {
    const setStatusAsync = (newStatus) =>
      new Promise((resolve) => {
        setStatus(newStatus);
        resolve();
      });

    showConfirmModal({
      icon: null,
      content: <p>Confirm to set product status to &apos;active&apos;</p>,
      centered: true,
      async onOk() {
        setSwitchState(true);
        await setStatusAsync(
          products?.status === "active" ? "draft" : "active",
        );
        submitBtnRef.current.click();
      },
    });
  };

  const handleEditSingleVariant = (id) => {
    setOpenSlider2(true);
    setEditVariantWithId(id);
  };

  return (
    <ProductForm
      handleFormSubmit={handleFormSubmit}
      nameRef={nameRef}
      description={description}
      setDescription={setDescription}
      submitBtnRef={submitBtnRef}
      prodLoading={prodLoading}
      showConfirm={showConfirm}
      selectedProduct={products}
      switchState={switchState}
      catList={catList}
      selectedCatKeys={selectedCatKeys}
      collectionList={collectionList}
      setSelectedCatKeys={setSelectedCatKeys}
      selectedCollectionKeys={selectedCollectionKeys}
      setSelectedCollectionKeys={setSelectedCollectionKeys}
      openSlider1={openSlider1}
      setOpenSlider1={setOpenSlider1}
      openSlider2={openSlider2}
      setOpenSlider2={setOpenSlider2}
      handleEditSingleVariant={handleEditSingleVariant}
      actionType={actionType}
      fileList={fileList}
      setFileList={setFileList}
      defaultFileList={defaultFileList}
      setDefaultFileList={setDefaultFileList}
      priceRef={priceRef}
      discountRef={discountRef}
      quantityRef={quantityRef}
    />
  );
});

export default Page;
