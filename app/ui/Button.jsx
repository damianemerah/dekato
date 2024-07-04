import Link from "next/link";

export function Button({ children, className }) {
  return (
    <Link
      href="#"
      className={`${className} font-medium no-underline self-start py-2 px-8 border-2 hover:scale-105`}
    >
      {children}
    </Link>
  );
}

export function ButtonSecondary({ children, className }) {
  return (
    <button
      className={`py-2 p-4 bg-gray-200 rounded-lg hover:scale-105 ${className}`}
    >
      {children}
    </button>
  );
}
