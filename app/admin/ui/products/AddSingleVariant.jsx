import { memo, useCallback, useState, useEffect, useRef } from "react";
import DropDownSelect from "@/app/admin/ui/DropDown";
import ImageUpload from "@/app/admin/ui/products/MediaUpload";
import { useAdminStore } from "@/app/admin/store/variantStore";

import DeleteIcon from "@/public/assets/icons/remove.svg";
import { ButtonPrimary } from "@/app/ui/Button";
import ModalWrapper from "./ModalWrapper";

export default memo(function AddSingleVariant({
  setOpenSlider,
  openSlider,
  handleSaveSingleVariant,
}) {
  const variantOptions = useAdminStore((state) => state.variantOptions);
  const [showVarOptions, setShowVarOptions] = useState([]);
  const [seletedVariant, setSelectedVariant] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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
    !openSlider && setEditVariantWithId(null);
    if (fileInputRef.current) {
      console.log("Clearing files");
      fileInputRef.current.clearFiles();
    }
  }, [openSlider, setEditVariantWithId]);

  useEffect(() => {
    if (variants) {
      setSelectedVariant(
        variants.find((variant) => variant.id === editVariantWithId),
      );
    }
  }, [variants, editVariantWithId]);

  const toggleDropdown = useCallback((index) => {
    setShowVarOptions((prev) =>
      prev.map((show, i) => (i === index ? !show : show)),
    );
  }, []);

  const handleFilesChange = (files) => {
    setSelectedFile(files[0]);
  };

  const handleSelectedOption = (option, optionName) => {
    if (editVariantWithId) {
      updateVariant(editVariantWithId, {
        [optionName.toLowerCase()]: option,
      });
    } else {
      //add new variant
      addVariant({
        [optionName.toLowerCase()]: option,
      });
    }
  };
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
              selectedVariantVal={seletedVariant}
              handleSelectedOption={handleSelectedOption}
            />
          ))}
        </div>

        <ImageUpload
          ref={fileInputRef}
          onFilesChange={handleFilesChange}
          selectBtn={true}
          multiple={false}
        />
        <div className="flex items-center gap-4 py-2">
          <div className="flex w-full flex-col items-start gap-1.5">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              autoComplete="off"
              placeholder="100"
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
            />
          </div>
          <div className="flex w-full flex-col items-start gap-1.5">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              autoComplete="off"
              placeholder="100"
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
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
