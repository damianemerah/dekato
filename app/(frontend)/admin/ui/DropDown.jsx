import { memo, useRef, useEffect, useState } from "react";
import UpIcon from "@/public/assets/icons/up.svg";

export default memo(function DropDownSelect({
  showOptions: initialShowOptions,
  className,
  options,
  hasCheckbox = false,
  required = false,
  variationName,
  selectedVariantVal,
  handleSelectedOption,
}) {
  const [showOptions, setShowOptions] = useState(initialShowOptions);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`${className} relative cursor-pointer rounded-lg p-3 shadow-shadowSm hover:border hover:border-grayOutline`}
    >
      <div
        className="flex w-full items-center justify-between"
        onClick={() => setShowOptions((prevState) => !prevState)}
      >
        <p>
          <span className="opacity-50">{`${variationName.toUpperCase()}: `}</span>
          {selectedVariantVal ? (
            <span className="inline-block font-bold uppercase text-red-400 opacity-100">
              {selectedVariantVal}
            </span>
          ) : (
            <span className="opacity-60">Select option</span>
          )}
        </p>
        <UpIcon
          className={`transition-transform duration-300 ${
            showOptions ? "rotate-180 transform" : ""
          }`}
        />
      </div>

      <fieldset
        className={`${
          showOptions ? "block" : "hidden"
        } absolute left-0 right-0 top-full z-10 overflow-hidden rounded-lg bg-white shadow-shadowSm`}
      >
        {options?.map((option, index) => (
          <div
            className="flex items-center px-4 py-2 hover:bg-gray-100"
            key={index}
            onClick={() => {
              handleSelectedOption(option, variationName);
            }}
          >
            <input
              type={hasCheckbox ? "checkbox" : "radio"}
              id={`${variationName.toLowerCase()}_${index}`}
              name={variationName.toLowerCase()}
              className="mr-3 h-4 w-4"
              required={required}
              // value={option?.id || option}
              value={
                !hasCheckbox || variationName.toLowerCase() === "category"
                  ? option?.id || option
                  : option
              }
              checked={
                selectedVariantVal
                  ? selectedVariantVal.split(", ")?.includes(option.slug)
                  : Array.isArray(option) && option.includes(selectedVariantVal)
                    ? true
                    : false
              }
              onChange={() => handleSelectedOption(option, variationName)}
            />
            <label
              htmlFor={`${variationName.toLowerCase()}_${index}`}
              className="flex-1 text-base font-medium"
            >
              {option?.slug || option}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
});
