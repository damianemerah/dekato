"use client";
import ImageUpload from "@/app/admin/ui/products/MediaUpload";
import { Button, ButtonPrimary } from "@/app/ui/Button";
import { roboto } from "@/style/font";
import { useEffect, useState } from "react";
import VariantsSection from "@/app/admin/ui/products/ProductVariantForm";
import styles from "@/app/admin/products/new/AddProduct.module.css";
import upIcon from "@/public/assets/icons/up.svg";
import downIcon from "@/public/assets/icons/down.svg";
import Image from "next/image";
import arrowBack from "@/public/assets/icons/arrow_back.svg";
import Link from "next/link";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [showCatOptions, setShowCatOptions] = useState(false);
  const [selectedCat, setSelectedCat] = useState([]);

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
    <div className={`${roboto.className} mx-auto max-w-screen-lg px-5`}>
      <div className="flex items-center py-6">
        <Link href="/admin/products">
          <Image src={arrowBack} alt="Go back icon" className="mr-4" />
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
                className="mb-1 block text-xxs font-bold tracking-wider text-primary"
              >
                TITLE
              </label>
              <input
                type="text"
                name="title"
                id="title"
                autoComplete="off"
                placeholder="Short sleeve t-shirt"
                className="block w-full rounded-md px-3 py-[6px] text-sm shadow-shadowSm hover:border hover:border-grayOutline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="mb-1 block text-xxs font-bold tracking-wider text-primary"
              >
                DESCRIPTION
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="A short sleeve t-shirt made from organic cotton."
                className="block h-28 w-full resize-none rounded-md px-3 py-[6px] text-sm shadow-shadowSm hover:border hover:border-grayOutline"
              ></textarea>
            </div>
          </div>
          <ImageUpload onFilesChange={handleFilesChange} />
          <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-white p-4 shadow-shadowSm">
            <div>
              <label
                htmlFor="price"
                className="mb-1 block text-xxs font-bold tracking-wider text-primary"
              >
                PRICE
              </label>
              <input
                type="number"
                name="price"
                id="price"
                autoComplete="off"
                placeholder="100"
                className="block w-full rounded-md px-3 py-[6px] text-sm shadow-shadowSm hover:border hover:border-grayOutline"
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="mb-1 block text-xxs font-bold tracking-wider text-primary"
              >
                COMPARE PRICE
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                autoComplete="off"
                placeholder="100"
                className="block w-full rounded-md px-3 py-[6px] text-sm shadow-shadowSm hover:border hover:border-grayOutline"
              />
            </div>
          </div>
          <div className="mb-4 rounded-lg bg-white p-4 shadow-shadowSm">
            <label
              className="mb-1 block text-xxs font-bold tracking-wider text-primary"
              htmlFor="quantity"
            >
              INVENTORY
            </label>
            <h3 className="mb-1 block text-sm text-slate-700">Quantity</h3>
            <input
              type="number"
              name="quantity"
              id="quantity"
              autoComplete="off"
              placeholder="100"
              className="block w-full rounded-md px-3 py-[6px] text-sm shadow-shadowSm hover:border hover:border-grayOutline md:w-1/2"
            />
          </div>
          <VariantsSection />
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
              <div className="text-lg font-bold text-primary">. . .</div>
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
              <span className="ml-4 inline-block text-xxs font-bold tracking-wider opacity-70">
                {isToggle ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow-shadowSm">
            <div className="p-4">
              <h3
                htmlFor="category"
                className="mb-1 block text-xxs font-bold tracking-wider text-primary"
              >
                CATEGORY
              </h3>
              <div
                className="relative flex items-center justify-between rounded-lg p-3 shadow-shadowSm hover:border hover:border-grayOutline"
                onClick={() => setShowCatOptions(!showCatOptions)}
              >
                <span className="opacity-50">Choose category</span>
                <Image src={showCatOptions ? upIcon : downIcon} alt="Up icon" />

                <div
                  className={`${showCatOptions ? "block" : "hidden"} absolute left-0 right-0 top-full overflow-hidden rounded-lg bg-white shadow-shadowSm`}
                >
                  <div className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <input type="checkbox" id="men" className="mr-3 h-4 w-4" />
                    <label
                      htmlFor="men"
                      className="flex-1 text-base font-medium"
                    >
                      men
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
