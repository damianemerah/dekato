import Link from "next/link";
import { oswald } from "@/style/font";

export function Button({ children, className, type }) {
  return (
    <button
      href="#"
      className={`self-start border-2 border-primary px-8 py-1 text-[13px] font-semibold no-underline ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}

export function ButtonPrimary({
  children,
  className,
  onClick,
  type,
  disabled,
}) {
  return (
    <button
      className={`${oswald.className} h-[44px] px-8 py-2 text-white active:scale-95 ${className} uppercase`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function ButtonSecondary({ children, className, onClick, type }) {
  return (
    <button
      className={`bg-gray-200 px-3 py-1 hover:bg-opacity-85 ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
