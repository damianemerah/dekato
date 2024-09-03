"use client";
import Link from "next/link";
import { roboto } from "@/style/font";
import { useState, memo, useRef, useEffect, useCallback } from "react";
import AddSingleVariant from "@/app/(frontend)/admin/ui/products/AddSingleVariant";
import VariantsSection from "@/app/(frontend)/admin/ui/products/ProductVariantForm";
import EditVariant from "@/app/(frontend)/admin/ui/products/EditVariant";
import {
  useAdminStore,
  useCategoryStore,
  useProductStore,
} from "@/app/(frontend)/admin/store/adminStore";
import BackIcon from "@/public/assets/icons/arrow_back.svg";
import {
  createProduct,
  getAdminProduct,
  updateProduct,
} from "@/app/action/productAction";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";
import { Switch, Modal, message, Spin, Space } from "antd";
import useSWR from "swr";
import DropDown from "@/app/(frontend)/admin/ui/DropDown2";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/app/action/categoryAction";
import { LoadingOutlined } from "@ant-design/icons";

const { confirm } = Modal;

//generate variantOptions
const generateVariantOptions = (variants) => {
  const clonedVariants = [...variants];

  // console.log(clonedVariants, "clonedVariants");

  const result = {};
  clonedVariants.forEach((variant) => {
    Object.entries(variant.options).forEach(([key, value]) => {
      if (!result[key]) {
        result[key] = new Set();
      }
      result[key].add(value);
    });
  });
  const formattedResult = Object.keys(result).map((key) => ({
    id: uuidv4(),
    name: key,
    values: Array.from(result[key]),
  }));
  // console.log(formattedResult, "formattedResult");
  return formattedResult;
};

export default memo(function Page({ params }) {
  const slug = params.slug;
  const [fileList, setFileList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [switchState, setSwitchState] = useState(false);
  const [selectedCatKeys, setSelectedCatKeys] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openSlider1, setOpenSlider1] = useState(false);
  const [openSlider2, setOpenSlider2] = useState(false);
  const [actionType, setActionType] = useState("");
  const [status, setStatus] = useState("draft");
  const [prodLoading, setProdLoading] = useState(false);

  const router = useRouter();

  const descriptionRef = useRef(null);
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);
  const comparePriceRef = useRef(null);
  const submitBtnRef = useRef(null);

  const { data: allCategories, isLoading: catIsLoading } = useSWR(
    "/admin/categories",
    getAllCategories,
  );
  const setEditVariantWithId = useAdminStore(
    (state) => state.setEditVariantWithId,
  );
  const variants = useAdminStore((state) => state.variants);
  const setVariants = useAdminStore((state) => state.setVariants);
  const setCurVariantOptions = useAdminStore(
    (state) => state.setCurVariantOptions,
  );
  const addVariantOptions = useAdminStore((state) => state.addVariantOptions);
  const setProducts = useProductStore((state) => state.setProducts);
  const { data: products, isLoading } = useSWR(
    "/admin/products",
    () => getAdminProduct(),
    {
      onSuccess: (prods) => {
        return setProducts(prods);
      },
    },
  );

  useEffect(() => {
    if (catIsLoading) return;
    if (allCategories?.length) {
      const category = allCategories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));

      setCatList(category);
    }
  }, [allCategories, catIsLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (slug !== "new" && products?.length) {
      const selectedProduct = products.find((product) => product.id === slug);

      if (selectedProduct) {
        setActionType("edit");
        setSelectedProduct(selectedProduct);
        setVariants(selectedProduct?.variant);
        setCurVariantOptions(generateVariantOptions(selectedProduct?.variant));

        const seletedImgs = selectedProduct.image.map((img, index) => {
          return {
            uid: index,
            name: "image.png",
            status: "done",
            url: img,
          };
        });
        if (selectedProduct?.category) {
          const productCatId = selectedProduct?.category.map((cat) => cat.id);

          setSelectedCatKeys(productCatId);
        }

        setDefaultFileList(seletedImgs);
        descriptionRef.current.value = selectedProduct.description || "";
        nameRef.current.value = selectedProduct.name || "";
        priceRef.current.value = selectedProduct.price || "";
        quantityRef.current.value = selectedProduct.quantity || "";
        comparePriceRef.current.value = selectedProduct?.comparePrice || "";
      }
    } else if (slug === "new") {
      setActionType("create");
      setSelectedProduct(null);
    } else {
      router.push("/admin/products/new");
    }
  }, [
    slug,
    products,
    isLoading,
    setEditVariantWithId,
    addVariantOptions,
    setCurVariantOptions,
    setVariants,
    router,
  ]);

  const handleFormSubmit = async (formData) => {
    alert("submit");
    try {
      setProdLoading(true);
      setTimeout(() => {
        setProdLoading(false);
      }, 5000);
      formData.append("status", status);

      const medias = getFiles(fileList);
      medias.images.forEach((file) => {
        formData.append("image", file);
      });
      medias.videos.forEach((file) => {
        formData.append("video", file);
      });

      if (variants.length > 0) {
        variants.forEach((variant, index) => {
          const { id, imageURL, image, ...rest } = variant;
          const isUUID = (id) => {
            const uuidRegex =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(id);
          };

          if (!isUUID(id)) {
            rest._id = id;
          }

          // Serialize the non-file data
          const serializedVariant = JSON.stringify(rest);
          formData.append(`variantData[${index}]`, serializedVariant);

          // Append file if it exists
          if (image?.originFileObj instanceof File) {
            formData.append(`variantImage[${index}]`, image.originFileObj);
          } else if (image && typeof image === "string") {
            formData.append(`variantImage[${index}]`, image);
          }
        });
      }

      if (selectedCatKeys.length > 0) {
        selectedCatKeys.forEach((catId) => {
          formData.append("category", catId);
        });
      }

      if (actionType === "create") {
        const product = await createProduct(formData);

        if (product.status === "error") {
          throw new Error(product.message);
        }
        message.success("Product created");
        router.push(`/admin/products/${product.id}`);
      }

      if (actionType === "edit") {
        formData.append("id", slug);

        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        const product = await updateProduct(formData);
        if (product.status === "error") {
          throw new Error(product.message);
        }
        message.success("Product updated");
        router.push(`/admin/products/${product.id}`);
      }

      // clear inputs after successful submission
      // if (fileInputRef.current) {
      //   fileInputRef.current.clearFiles();
      //   //clear input fields
      //   const inputs = document.querySelectorAll("input");
      //   inputs.forEach((input) => {
      //     input.value = "";
      //   });
      //   document.querySelector("textarea").value = "";
      //   const checkbox = document.querySelectorAll("input[type='checkbox']");
      //   checkbox.forEach((box) => {
      //     box.checked = false;
      //   });
      // }
    } catch (err) {
      message.error(err.message);
    } finally {
      setSwitchState(false);
      setProdLoading(false);
    }
  };

  const showConfirm = () => {
    const setStatusAsync = (newStatus) => {
      return new Promise((resolve) => {
        setStatus(newStatus);
        resolve();
      });
    };

    confirm({
      icon: null,
      content: <p>Confirm to set product status to &apos;active&apos;</p>,
      centered: true,
      async onOk() {
        if (selectedProduct?.status === "active") {
          setSwitchState(true);
          await setStatusAsync("draft");
          submitBtnRef.current.click();
          return;
        }
        setSwitchState(true);
        await setStatusAsync("active");
        submitBtnRef.current.click();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleEditSingleVariant = (id) => {
    setOpenSlider2(true);
    setEditVariantWithId(id);
  };

  return (
    <div className="relative h-full">
      <div className={`${roboto.className} mx-auto px-10 py-20`}>
        <div className="mb-12 flex items-center">
          <Link href="/admin/products">
            <BackIcon className="mr-4 cursor-pointer text-xl font-bold" />
          </Link>
          <h3 className="text-xl font-medium">Products</h3>
        </div>
        <h2 className="mb-8 text-2xl font-medium tracking-wide">Add Product</h2>
        <form
          action={handleFormSubmit}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary"
                >
                  TITLE
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  id="name"
                  ref={nameRef}
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
                  name="description"
                  ref={descriptionRef}
                  id="description"
                  placeholder="A short sleeve t-shirt made from organic cotton."
                  className="block h-28 w-full resize-none rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
                ></textarea>
              </div>
            </div>
            <div className="mb-6 rounded-lg bg-white p-6 shadow-shadowSm">
              <MediaUpload
                multiple={true}
                fileList={fileList}
                setFileList={setFileList}
                defaultFileList={defaultFileList}
                setDefaultFileList={setDefaultFileList}
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-white p-4 shadow-shadowSm">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary"
                >
                  PRICE
                </label>
                <input
                  ref={priceRef}
                  type="number"
                  name="price"
                  required
                  id="price"
                  autoComplete="off"
                  placeholder="100"
                  className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary"
                >
                  COMPARE PRICE
                </label>
                <input
                  ref={comparePriceRef}
                  type="number"
                  name="stock"
                  id="stock"
                  autoComplete="off"
                  placeholder="100"
                  className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
                />
              </div>
            </div>
            <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
              <h3 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
                QUANTITY
              </h3>
              <input
                ref={quantityRef}
                type="number"
                name="quantity"
                id="quantity"
                required
                autoComplete="off"
                placeholder="100"
                className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline md:w-1/2"
              />
            </div>
            <VariantsSection handleOpenSlider={() => setOpenSlider1(true)} />
          </div>
          <div>
            <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
              <div className="flex w-full items-center justify-center">
                <button
                  type="submit"
                  className="grow-1 mr-4 flex-1 rounded-md bg-primary px-16 py-2.5 text-white"
                  ref={submitBtnRef}
                >
                  <Space>
                    Save changes
                    {prodLoading && (
                      <Spin
                        indicator={
                          <LoadingOutlined spin className="!text-white" />
                        }
                        size="large"
                        fullscreen
                      />
                    )}
                  </Space>
                </button>
                <button className="text-xl font-bold tracking-wider text-primary">
                  ...
                </button>
              </div>
              <hr className="my-3 opacity-60" />
              <Switch
                loading={switchState}
                onClick={showConfirm}
                checked={selectedProduct?.status === "active" || false}
              />
            </div>
            <div className="rounded-lg bg-white shadow-shadowSm">
              <div className="p-4">
                <h3 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
                  CATEGORY
                </h3>

                <DropDown
                  options={catList}
                  mode="tags"
                  selectedKeys={selectedCatKeys}
                  handleChange={(value) => {
                    setSelectedCatKeys(value);
                  }}
                />
              </div>
            </div>
          </div>
        </form>
        <EditVariant
          openSlider={openSlider1}
          setOpenSlider={setOpenSlider1}
          handleOpenSlider2={() => setOpenSlider2(true)}
          handleEditSingleVariant={handleEditSingleVariant}
          actionType={actionType}
        />
        <AddSingleVariant
          openSlider={openSlider2}
          setOpenSlider={setOpenSlider2}
        />
      </div>
    </div>
  );
});
