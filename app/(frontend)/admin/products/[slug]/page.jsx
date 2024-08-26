"use client";
import Link from "next/link";
import { roboto } from "@/style/font";
import { useEffect, useState, memo, useRef } from "react";

import ImageUpload from "@/app/(frontend)/admin/ui/products/MediaUpload";
import AddSingleVariant from "@/app/(frontend)/admin/ui/products/AddSingleVariant";
import { ButtonPrimary } from "@/app/ui/button";
import VariantsSection from "@/app/(frontend)/admin/ui/products/ProductVariantForm";
import EditVariant from "@/app/(frontend)/admin/ui/products/EditVariant";
import {
  useAdminStore,
  useCategoryStore,
} from "@/app/(frontend)/admin/store/adminStore";
import DropDownSelect from "@/app/(frontend)/admin/ui/DropDown";
import BackIcon from "@/public/assets/icons/arrow_back.svg";
import styles from "./AddProduct.module.css";
import { createProduct } from "@/app/action/productAction";
import { message } from "antd";
import { getFiles } from "@/app/(frontend)/admin/utils/utils";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";

export default memo(function Page({ params }) {
  const slug = params.slug;
  const [fileList, setFileList] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [showCatOptions, setShowCatOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [openSlider1, setOpenSlider1] = useState(false);
  const [openSlider2, setOpenSlider2] = useState(false);

  const toggleRef = useRef(null);

  const allCategories = useCategoryStore((state) => state.allCategories);
  const setEditVariantWithId = useAdminStore(
    (state) => state.setEditVariantWithId,
  );
  const variants = useAdminStore((state) => state.variants);

  // useEffect(() => {
  //   const toggleElement = toggleRef.current;
  //   const handleChange = (e) => {
  //     setIsToggle(e.target.checked);
  //   };
  //   toggleElement.addEventListener("change", handleChange);
  //   return () => {
  //     toggleElement.removeEventListener("change", handleChange);
  //   };
  // }, []);

  const handleFormSubmit = async (formData) => {
    try {
      const medias = getFiles(fileList);
      console.log(medias);
      medias.images.forEach((file) => {
        formData.append("image", file);
      });
      medias.videos.forEach((file) => {
        formData.append("video", file);
      });

      if (!formData.get("category")) {
        throw new Error("Category is required");
      }

      if (variants.length > 0) {
        variants.forEach((variant, index) => {
          const { id, imageURL, image, ...rest } = variant;

          // Serialize the non-file data
          const serializedVariant = JSON.stringify(rest);
          formData.append(`variantData[${index}]`, serializedVariant);

          // Append file if it exists
          if (image instanceof File) {
            formData.append(`variantImage[${index}]`, image);
          }
        });
      }

      // for (let pairs of formData.entries()) {
      //   console.log(pairs[0], pairs[1]);
      // }

      const product = await createProduct(formData);

      if (product.status === "error") {
        throw new Error(product.message);
      }

      message.success("Product created");

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
    }
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
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
                type="number"
                name="quantity"
                id="quantity"
                required
                autoComplete="off"
                placeholder="100"
                className="block w-full rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline md:w-1/2"
              />
            </div>
            <VariantsSection
              handleOpenSlider={(e) => {
                e.preventDefault();
                return setOpenSlider1(true);
              }}
            />
          </div>
          <div className="">
            <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
              <div className="flex w-full items-center justify-center">
                <ButtonPrimary
                  type="submit"
                  className="grow-1 mr-4 flex-1 rounded-md bg-slate-900 px-16 py-2.5 text-white"
                >
                  Save changes
                </ButtonPrimary>
                <button className="text-xl font-bold tracking-wider text-primary">
                  ...
                </button>
              </div>
              <hr className="my-3 opacity-60" />
              <div className="flex items-center">
                <div className={styles["toggle-checkbox-wrapper"]}>
                  <input
                    ref={toggleRef}
                    onChange={() => setIsToggle(!isToggle)}
                    type="checkbox"
                    id="toggle"
                    className={styles["hidden-checkbox"]}
                  />
                  <div
                    className={styles["toggle-checkbox"]}
                    onClick={() => document.getElementById("toggle").click()}
                  >
                    <div className={styles["toggle-thumb"]}></div>
                  </div>
                </div>
                <span className="ml-4 inline-block text-xxs font-bold tracking-[0.12em] opacity-70">
                  {isToggle ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-white shadow-shadowSm">
              <div className="p-4">
                <h3 className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary">
                  CATEGORY
                </h3>
                <DropDownSelect
                  hasCheckbox={true}
                  showOptions={showCatOptions}
                  options={allCategories || []}
                  className="bg-white"
                  variationName="category"
                  selectedVariantVal={selectedCategory.join(", ")}
                  onClick={() => {
                    setShowCatOptions(!showCatOptions);
                  }}
                  handleSelectedOption={(option, name) => {
                    setSelectedCategory((prev) => {
                      const updatedCategories = new Set(prev);
                      if (updatedCategories.has(option.slug)) {
                        updatedCategories.delete(option.slug);
                        return Array.from(updatedCategories);
                      }
                      updatedCategories.add(option.slug);
                      return Array.from(updatedCategories);
                    });
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
        />
        <AddSingleVariant
          openSlider={openSlider2}
          setOpenSlider={setOpenSlider2}
          // handleSaveSingleVariant={handleSaveSingleVariant}
        />
      </div>
    </div>
  );
});
