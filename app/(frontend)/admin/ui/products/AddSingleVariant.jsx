import { memo, useCallback, useState, useEffect, useRef } from "react";
import DropDownSelect from "@/app/(frontend)/admin/ui/DropDown";
import DropDown from "@/app/(frontend)/admin/ui/DropDown2";
import ImageUpload from "@/app/(frontend)/admin/ui/products/MediaUpload";
import MediaUpload from "@/app/(frontend)/admin/ui/MediaUpload";

import { useAdminStore } from "@/app/(frontend)/admin/store/adminStore";

import DeleteIcon from "@/public/assets/icons/remove.svg";
import { ButtonPrimary } from "@/app/ui/Button";
import { v4 as uuidv4 } from "uuid";
import ModalWrapper from "./ModalWrapper";
import { message } from "antd";

export default memo(function AddSingleVariant({
  setOpenSlider,
  openSlider,
  // handleSaveSingleVariant,
}) {
  const [fileList, setFileList] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  // {
  //   uid: selectedCategory?.id,
  //   name: "image.png",
  //   status: "done",
  //   url: selectedCategory.image[0],
  // },
  const variantOptions = useAdminStore((state) => state.variantOptions);
  const [showVarOptions, setShowVarOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const inputQuantityRef = useRef(null);
  const inputPriceRef = useRef(null);

  const variants = useAdminStore((state) => state.variants);
  const editVariantWithId = useAdminStore((state) => state.editVariantWithId);
  const setEditVariantWithId = useAdminStore(
    (state) => state.setEditVariantWithId,
  );

  const updateVariant = useAdminStore((state) => state.updateVariant);
  const addVariant = useAdminStore((state) => state.addVariant);

  useEffect(() => {
    if (variantOptions) {
      setShowVarOptions(variantOptions.map(() => false));
    }
  }, [variantOptions]);

  useEffect(() => {
    if (!openSlider) {
      setEditVariantWithId(null);
      const radios = document.querySelectorAll("input[type='radio']");
      radios.forEach((radio) => {
        return (radio.checked = false);
      });

      const inputs = document.querySelectorAll("input[type='number']");
      inputs.forEach((input) => {
        return (input.value = "");
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.clearFiles();
    }
  }, [openSlider, setEditVariantWithId]);

  useEffect(() => {
    if (variants) {
      const selectedOpt = variants.find(
        (variant) => variant.id === editVariantWithId,
      );
      console.log(selectedOpt, "selectedOpt1234");
      setSelectedOption(selectedOpt);
    }
  }, [variants, editVariantWithId]);

  const handleSelectedFile = (files) => {
    setSelectedFile(files[0]);
    console.log(files, "files");
    setFileList(files[0]);
  };

  const toggleDropdown = useCallback((index) => {
    setShowVarOptions((prev) =>
      prev.map((show, i) => (i === index ? !show : show)),
    );
  }, []);

  const handleSaveSingleVariant = useCallback(() => {
    if (editVariantWithId) {
      const variant = variants.find(
        (variant) => variant.id === editVariantWithId,
      );

      if (
        variants.some(
          (variant) =>
            JSON.stringify(variant.options).toLowerCase() ===
            JSON.stringify(selectedOption.options).toLowerCase(),
        ) &&
        !selectedFile
      ) {
        setOpenSlider(false);
        return;
      }

      updateVariant(editVariantWithId, {
        options: selectedOption.options,
        quantity: inputQuantityRef.current.value,
        price: inputPriceRef.current.value,
        image: selectedFile ? selectedFile : variant.image,
      });
      setOpenSlider(false);
    } else if (selectedOption) {
      //prevent duplicate variants
      if (
        variants.some(
          (variant) =>
            JSON.stringify(variant.options).toLowerCase() ===
            JSON.stringify(selectedOption.options).toLowerCase(),
        )
      ) {
        setOpenSlider(false);
        return;
      }
      const id = uuidv4();
      addVariant({
        id,
      });
      updateVariant(id, {
        options: selectedOption.options,
        quantity: inputQuantityRef.current.value,
        price: inputPriceRef.current.value,
        image: selectedFile,
      });

      setOpenSlider(false);
    }
  }, [
    selectedOption,
    setOpenSlider,
    selectedFile,
    addVariant,
    editVariantWithId,
    updateVariant,
    variants,
  ]);

  const handleInputChange = useCallback(
    (id, val, field) => {
      if (isNaN(val) || val < 0) {
        message.warn("Please enter a valid number.");
        return;
      }
      updateVariant(id, { [field]: val });
    },
    [updateVariant],
  );

  return (
    <ModalWrapper setOpenSlider={setOpenSlider} openSlider={openSlider}>
      <div className="flex min-h-24 items-center justify-between px-6">
        <h1 className="text-xl font-medium text-primary">Edit Variants</h1>
        <div className="cursor-pointer rounded-md p-1 text-xl hover:bg-grayBg">
          <DeleteIcon onClick={() => setOpenSlider(false)} />
        </div>
      </div>
      <div className="h-full bg-grayBg p-6">
        <h2 className="font- mb-4 text-2xl text-primary">
          Select options for product variants
        </h2>
        <div className="mb-6 flex w-full items-center justify-center gap-4">
          {variantOptions?.map((option, index) => (
            <DropDownSelect
              key={index}
              showOptions={showVarOptions[index]}
              onClick={() => toggleDropdown(index)}
              options={option?.values}
              className="min-w-44 max-w-[250px] bg-white"
              variationName={option.name}
              selectedVariantVal={
                selectedOption?.options[option.name.toLowerCase()]
              }
              handleSelectedOption={(option, name) => {
                setSelectedOption((prev) => ({
                  options: {
                    ...prev?.options,
                    [name.toLowerCase()]: option,
                  },
                }));
              }}
            />
          ))}
        </div>
        <ImageUpload
          ref={fileInputRef}
          onFilesChange={handleSelectedFile}
          selectBtn={true}
          multiple={false}
          varImg="variantImage"
        />

        <div className="mb-6 rounded-lg bg-white p-6 shadow-shadowSm">
          <MediaUpload
            multiple={false}
            fileList={fileList}
            setFileList={setFileList}
            defaultFileList={defaultFileList}
          />
        </div>
        <div className="flex items-center gap-4 py-2">
          <div className="flex w-full flex-col items-start gap-1.5">
            <label htmlFor="quantity">Quantity</label>
            <input
              ref={inputQuantityRef}
              type="number"
              name="quantity"
              id="quantity"
              autoComplete="off"
              placeholder="Enter quantity"
              value={
                variants.find((variant) => variant.id === editVariantWithId)
                  ?.quantity
              }
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
              onChange={(e) =>
                handleInputChange(editVariantWithId, e.target.value, "quantity")
              }
            />
          </div>
          <div className="flex w-full flex-col items-start gap-1.5">
            <label htmlFor="price">Price</label>
            <input
              ref={inputPriceRef}
              type="number"
              name="price"
              id="price"
              autoComplete="off"
              placeholder="Enter price"
              value={
                variants.find((variant) => variant.id === editVariantWithId)
                  ?.price
              }
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
              onChange={(e) =>
                handleInputChange(editVariantWithId, e.target.value, "price")
              }
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 right-0 mr-5 flex w-full items-center justify-end gap-6 bg-white px-6 py-6">
        <button
          className="text-[15px] font-bold tracking-wider"
          onClick={() => setOpenSlider(false)}
        >
          Cancel
        </button>
        <ButtonPrimary
          className="!rounded-md !px-3.5 py-4 text-base font-bold tracking-wide"
          onClick={() => handleSaveSingleVariant(selectedFile)}
        >
          Add variant
        </ButtonPrimary>
      </div>
    </ModalWrapper>
  );
});
