import { memo } from "react";
import Link from "next/link";

const CategoryLink = ({ category }) => {
  console.log(category);
  return (
    <Link
      href={category.slug}
      className="flex aspect-square w-full items-end justify-center !bg-cover px-2 pb-4 text-lg font-bold text-white sm:px-3 sm:pb-6 sm:text-xl md:px-4 md:pb-8 md:text-2xl lg:px-5 lg:pb-10"
      style={{
        background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.5) 50%), url('${category.image[0]}?w=400&h=400&q=75')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {category.name}
    </Link>
  );
};

export default memo(CategoryLink);
