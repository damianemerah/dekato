import { oswald } from "@/style/font";

export function Button({ children, className, type }) {
  return (
    <button
      href="#"
      className={`${className} ${oswald.className} self-start border-2 border-primary px-8 py-1 text-[13px] font-semibold no-underline`}
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
      className={`${oswald.className} ${className} h-[44px] px-8 py-2 uppercase text-white active:scale-95`}
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
      className={` ${className} bg-gray-200 px-3 py-1 hover:bg-opacity-85`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
