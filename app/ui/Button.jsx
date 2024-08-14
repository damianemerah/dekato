import Link from "next/link";

export function Button({ children, className }) {
  return (
    <Link
      href="#"
      className={`self-start border-2 px-8 py-2 font-medium no-underline hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </Link>
  );
}

export function ButtonPrimary({ children, className, onClick, type }) {
  return (
    <button
      className={`rounded-sm bg-primary px-8 py-2 text-white active:scale-95 ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function ButtonSecondary({ children, className, onClick }) {
  return (
    <button
      className={`rounded-sm bg-gray-200 px-3 py-1 hover:scale-105 active:scale-95 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
