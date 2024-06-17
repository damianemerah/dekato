import Link from "next/link";

export default function Button({ children, className }) {
  return (
    <Link
      href="#"
      className={`${className} font-medium hover:no-underline self-start py-2 px-8 border-2 `}
    >
      {children}
    </Link>
  );
}
