import { useState } from "react";
import DropDownSelect from "@/app/admin/ui/DropDown";
import ImageUpload from "@/app/admin/ui/products/MediaUpload";

import DeleteIcon from "@/public/assets/icons/remove.svg";
import { ButtonPrimary } from "@/app/ui/Button";

const varOptions = [
  { name: "Color", values: ["Red", "Blue", "Green"] },
  { name: "Size", values: ["S", "M", "L"] },
  { name: "Material", values: ["Cotton", "Polyester", "Silk"] },
];
export default function AddSingleVariant({ setOpenSlider, openSlider }) {
  const [showVarOptions, setShowVarOptions] = useState(function () {
    return varOptions.map(() => false);
  });

  const toggleDropdown = (index) => {
    setShowVarOptions((prev) =>
      prev.map((show, i) => (i === index ? !show : show)),
    );
  };

  const handleFilesChange = (files) => {
    console.log(files);
  };

  return (
    <div
      className={`fixed inset-0 transition-transform duration-500 ${openSlider ? "translate-x-0" : "translate-x-full"} z-50 overflow-x-hidden`}
    >
      <div
        className="absolute inset-0 z-10 h-full w-full bg-white bg-opacity-70"
        onClick={() => setOpenSlider(false)}
      ></div>
      <div className="absolute right-0 top-0 z-20 h-full w-full max-w-5xl bg-white shadow-shadowBig">
        <div className="flex min-h-24 items-center justify-between px-6">
          <h1 className="text-xl font-medium text-primary">Edit Variants</h1>
          <DeleteIcon
            className="cursor-pointer text-xl"
            onClick={() => setOpenSlider(false)}
          />
        </div>
        <div className="h-full bg-grayBg p-6">
          <h2 className="font- mb-4 text-2xl text-primary">
            Select options for product variants
          </h2>
          <div className="mb-6 flex w-full items-center justify-between gap-4 overflow-x-auto">
            {varOptions.map((option, index) => (
              <DropDownSelect
                key={index}
                showOptions={showVarOptions[index]}
                setShowOptions={setShowVarOptions[index]}
                toggleDropdown={() => toggleDropdown(index)}
                options={["color", "size", "material"]}
                className="min-w-44 max-w-[250px] bg-white"
              />
            ))}
          </div>

          <ImageUpload onFilesChange={handleFilesChange} selectBtn={true} />
          <div className="flex items-center gap-4 py-2">
            <input
              type="number"
              name="price"
              id="price"
              autoComplete="off"
              placeholder="100"
              className="block w-full rounded-md bg-white px-3 py-4 text-sm shadow-shadowSm hover:border hover:border-grayOutline focus:outline-none"
            />
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
        <div className="sticky bottom-0 right-0 mr-5 flex w-full items-center justify-end gap-6 bg-white px-6 py-6">
          <button className="text-[15px] font-bold tracking-wider">
            Cancel
          </button>
          <ButtonPrimary className="!rounded-md !px-3.5 py-4 text-base font-bold tracking-wide">
            Add variant
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
