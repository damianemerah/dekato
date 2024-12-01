"use client";

import { useState, memo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import { message } from "antd";
import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";
import {
  createProduct,
  getAdminProductById,
  updateProduct,
  setProductStatus,
} from "@/app/action/productAction";
import { getAllCategories } from "@/app/action/categoryAction";
import { getAllCollections } from "@/app/action/collectionAction";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import { generateVariantOptions } from "@/utils/getFunc";
import useConfirmModal from "@/app/ui/confirm-modal";
import { useUserStore } from "@/store/store";
import ProductForm from "@/app/(frontend)/admin/ui/products/productForm";

const Page = memo(function Page({ slug }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [fileList, setFileList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(true);
  const [switchState, setSwitchState] = useState(false);
  const [selectedCatKeys, setSelectedCatKeys] = useState([]);
  const [selectedCollectionKeys, setSelectedCollectionKeys] = useState([]);
  const [openSlider1, setOpenSlider1] = useState(false);
  const [openSlider2, setOpenSlider2] = useState(false);
  const [actionType, setActionType] = useState("");
  const [status, setStatus] = useState("inactive");
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
  const setDefaultVariantOptions = useAdminStore(
    (state) => state.setDefaultVariantOptions,
  );

  const { data: allCategoriesData, isLoading: catIsLoading } = useSWRImmutable(
    "/api/allCategories",
    () => getAllCategories({ limit: 100 }),
    { revalidateOnFocus: false },
  );

  const { data: products, isLoading } = useSWR(
    `/admin/products/${slug}`,
    () => (slug !== "new" ? getAdminProductById(slug) : null),
    {
      revalidateOnFocus: false,
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
      setDefaultVariantOptions(generateVariantOptions(product?.variant));
      if (Array.isArray(product?.image))
        setDefaultFileList(
          product?.image.map((img, index) => ({
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
      setStatus(product.status || "inactive");
    },
    [setDefaultVariantOptions, setVariants],
  );

  useEffect(() => {
    if (!products) return;
    setIsSwitchDisabled(quantityRef?.current?.value === 0 || !quantityRef);
  }, [quantityRef, products]);

  useEffect(() => {
    if (!catIsLoading && allCategoriesData?.data?.length) {
      setCatList(
        allCategoriesData.data.map((cat) => ({
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
  }, [allCategoriesData, catIsLoading]);

  useEffect(() => {
    if (!collectionIsLoading && collections?.data?.length) {
      setCollectionList(
        collections.data.map((collection) => ({
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
      setDefaultVariantOptions([]);
    } else {
      router.push("/admin/products");
    }
  }, [
    slug,
    products,
    isLoading,
    router,
    initializeEditMode,
    setDefaultVariantOptions,
  ]);

  const handleFormSubmit = async (formData) => {
    try {
      setProdLoading(true);
      formData.append("status", status);
      formData.append("description", description);

      const medias = getFiles(fileList, "image🚀✔️");
      medias.images.forEach((file) => formData.append("image", file));
      medias.videos.forEach((file) => formData.append("video", file));

      variants.forEach((variant, index) => {
        const { id, image, imageURL, ...rest } = variant;
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

      const action = actionType === "create" ? createProduct : updateProduct;
      if (actionType === "edit") formData.append("id", slug);

      const product = await action(formData);
      if (product.status === "error") throw new Error(product.message);

      mutate(`/admin/products/${product.id}`);
      mutate(`/cart/${user.id}`);
      message.success(
        `Product ${actionType === "create" ? "created" : "updated"}`,
      );

      if (actionType === "create") {
        router.push(`/admin/products/${product.id}`);
      }
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
    const newStatus = status === "active" ? "inactive" : "active";
    const confirmMessage = `Confirm to set product status to '${newStatus}'`;

    showConfirmModal({
      icon: null,
      content: <p>{confirmMessage}</p>,
      centered: true,
      async onOk() {
        setSwitchState(true);
        await setProductStatus(products.id, newStatus);
        setStatus(newStatus);
        setSwitchState(false);
        message.success(
          `Product status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        );
        mutate(`/admin/products/${products.id}`, (data) => ({
          ...data,
          status: newStatus,
        }));
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
      isSwitchDisabled={isSwitchDisabled}
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
