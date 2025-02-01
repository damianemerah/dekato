import Image from "next/image";
import CheckmarkIcon from "@/public/assets/icons/check.svg?url";
import { memo } from "react";

const VariantOptionMap = memo(function VariantOptionMap({
  option,
    selectedVariantOption,
    handleVariantSelection,
    isOptionAvailable,
    product,
    variationList,
  }) {
    const matchingVariation = variationList?.find((v) => v.name === option.name);
    const optionValues = matchingVariation
      ? [...new Set([...matchingVariation.values, ...option.values])]
      : option.values;

    return (
      <div key={option.id} className="mb-4">
        <p className={`mb-2 text-sm font-medium text-gray-700`}>
          <span className="capitalize">{option.name}</span>:{" "}
          <span className="font-bold uppercase">
            {selectedVariantOption[option.name] || "Select"}
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          {optionValues.map((value, index) => {
            const isAvailable = isOptionAvailable(option.name, value);
            return option.name === "color" ? (
              <div
                key={value}
                className={`border-1 relative h-16 w-16 rounded-full border-secondary ${
                  selectedVariantOption[option.name] === value
                    ? "border-2 border-primary"
                    : "border-gray-300"
                } cursor-pointer transition-all duration-200 hover:shadow-md`}
                onClick={() => handleVariantSelection(option.name, value)}
              >
                <Image
                  src={
                    product.variant.find((v) => v.options.color === value)
                      ?.image || ""
                  }
                  alt={`Variant ${value}`}
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover"
                />
                {selectedVariantOption[option.name] === value && (
                  <CheckmarkIcon className="absolute inset-0 m-auto h-6 w-6 fill-white" />
                )}
              </div>
            ) : (
              <button
                key={index}
                className={`relative h-10 min-w-[2.5rem] max-w-[4rem] border p-1 text-sm ${
                  selectedVariantOption[option.name] === value
                    ? isAvailable
                      ? "border-b-[3px] border-primary text-primary"
                      : "border-b-[3px] border-primary border-b-gray-500 text-primary"
                    : "border-gray-300 text-gray-700"
                } uppercase ${
                  !isAvailable
                    ? "border-primary opacity-50 before:absolute before:inset-0 before:left-1/2 before:top-1/2 before:h-[1px] before:w-[130%] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-gray-500 before:opacity-70 before:content-['']"
                    : ""
                } truncate transition-all duration-200`}
                onClick={() => handleVariantSelection(option.name, value)}
                title={value}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    );
  });

export default VariantOptionMap;
