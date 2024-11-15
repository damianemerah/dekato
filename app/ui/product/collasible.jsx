import { oswald } from "@/style/font";
import { memo, useRef } from "react";

const CollapsibleSection = memo(function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}) {
  const contentRef = useRef(null);

  return (
    <li className="border-b border-gray-200 px-2 sm:px-5">
      <button
        className={`${oswald.className} flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-800 hover:text-primary focus:outline-none`}
        onClick={onToggle}
      >
        {title}
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="h-0.5 w-3 bg-gray-600 transition-transform duration-300" />
          <span
            className={`absolute h-0.5 w-3 bg-gray-600 transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-90"
            }`}
          />
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          height: isOpen ? contentRef.current?.scrollHeight : 0,
        }}
      >
        <div className="pb-4 text-sm font-light text-gray-700">{children}</div>
      </div>
    </li>
  );
});

export default CollapsibleSection;
