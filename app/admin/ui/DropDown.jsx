import { memo } from "react";
import UpIcon from "@/public/assets/icons/up.svg";

export default memo(function DropDownSelect({
  showOptions,
  className,
  onClick,
  options,
  hasCheckbox = false,
  variationName,
}) {
  return (
    <div
      className={`${className} relative flex w-full cursor-pointer items-center justify-between rounded-lg p-3 shadow-shadowSm hover:border hover:border-grayOutline`}
      onClick={onClick}
    >
      <span className="opacity-50">
        {variationName ? (
          <>
            {`${variationName.toUpperCase()}: `}
            <span className="font-bold">bold text here</span>
          </>
        ) : (
          "Group name"
        )}
      </span>
      <UpIcon
        className={`transition-transform duration-300 ${showOptions ? "rotate-180 transform" : ""}`}
      />

      <div
        className={`${showOptions ? "block" : "hidden"} absolute left-0 right-0 top-full z-10 overflow-hidden rounded-lg bg-white shadow-shadowSm`}
      >
        {options?.map((option, index) => (
          <div
            className="flex items-center px-4 py-2 hover:bg-gray-100"
            key={index}
          >
            {hasCheckbox && (
              <input type="checkbox" id="men" className="mr-3 h-4 w-4" />
            )}
            <label htmlFor="men" className="flex-1 text-base font-medium">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
});
