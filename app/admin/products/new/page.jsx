"use client";
import Link from "next/link";
import { roboto } from "@/style/font";
import { useEffect, useState } from "react";

import ImageUpload from "@/app/admin/ui/products/MediaUpload";
import AddSingleVariant from "@/app/admin/ui/products/AddSingleVariant";
import { Button, ButtonPrimary } from "@/app/ui/Button";
import VariantsSection from "@/app/admin/ui/products/ProductVariantForm";
import EditVariant from "@/app/admin/ui/products/EditVariant";

import styles from "@/app/admin/products/new/AddProduct.module.css";
import UpIcon from "@/public/assets/icons/up.svg";
import BackIcon from "@/public/assets/icons/arrow_back.svg";
import downIcon from "@/public/assets/icons/down.svg";
import DropDownSelect from "@/app/admin/ui/DropDown";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [showCatOptions, setShowCatOptions] = useState(false);
  const [selectedCat, setSelectedCat] = useState([]);
  const [openSlider1, setOpenSlider1] = useState(false);
  const [openSlider2, setOpenSlider2] = useState(false);

  useEffect(() => {
    const toggleElement = document.getElementById("toggle");
    const handleChange = (e) => {
      setIsToggle(e.target.checked);
    };
    toggleElement.addEventListener("change", handleChange);
    return () => {
      toggleElement.removeEventListener("change", handleChange);
    };
  }, []);

  const handleFormSubmit = (formData) => {
    console.log("Medias", formData.getAll("media"));
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  return (
    <div className="relative h-full">
      <div className={`${roboto.className} mx-auto max-w-screen-lg px-5`}>
        <div className="flex items-center py-6">
          <Link href="/admin/products">
            <BackIcon className="mr-4 cursor-pointer text-xl font-bold" />
          </Link>
          <h2 className="text-xl font-medium">Add product</h2>
        </div>
        <form
          action={handleFormSubmit}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="mb-1 block text-xxs font-bold tracking-[0.12em] text-primary"
                >
                  TITLE
                </label>
                <input
                  type="text"
                  name="title"
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
                  name="description"
                  id="description"
                  placeholder="A short sleeve t-shirt made from organic cotton."
                  className="block h-28 w-full resize-none rounded-md px-3 py-3 text-sm shadow-shadowSm hover:border hover:border-grayOutline"
                ></textarea>
              </div>
            </div>
            <ImageUpload onFilesChange={handleFilesChange} />
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
            <VariantsSection handleOpenSlider={() => setOpenSlider1(true)} />
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
                  showOptions={showCatOptions}
                  setShowOptions={setShowCatOptions}
                  toggleDropdown={() => setShowCatOptions((prev) => !prev)}
                  options={["MEN"]}
                  hasCheckbox={true}
                />
              </div>
            </div>
          </div>
        </form>
        <EditVariant
          openSlider={openSlider1}
          setOpenSlider={setOpenSlider1}
          handleOpenSlider2={() => setOpenSlider2(true)}
        />
        <AddSingleVariant
          openSlider={openSlider2}
          setOpenSlider={setOpenSlider2}
        />
      </div>
    </div>
  );
}
