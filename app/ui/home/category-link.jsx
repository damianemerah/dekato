import { memo } from "react";
import Link from "next/link";

const CategoryLink = ({ category }) => {
  return (
    <Link
      href={category.slug}
      className="relative flex aspect-square w-full items-end justify-center overflow-hidden px-2 pb-4 text-center text-lg font-bold text-white sm:px-3 sm:pb-6 sm:text-xl md:px-4 md:pb-8 md:text-2xl lg:px-5 lg:pb-10"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.5) 50%), url('${category.image[0]}?w=400&h=400&q=75')`,
        }}
      />
      <span className="relative z-10">{category.name}</span>
    </Link>
  );
};

export default memo(CategoryLink);
