import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CategoryLink = ({ category }) => {
  return (
    <Link
      href={`/shop/${category.path[0]}`}
      className="relative flex aspect-[2/3] max-h-[280px] w-full max-w-[200px] items-end justify-center overflow-hidden px-2 pb-4 text-center text-lg font-bold text-white sm:px-3 sm:pb-6 sm:text-xl md:px-4 md:pb-8 md:text-2xl lg:px-5 lg:pb-10"
    >
      <div className="absolute inset-0">
        <Image
          src={`${category.image[0]}?w=400&h=400&q=75`}
          alt={category.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/20 to-black/50" />
      </div>
      <span className="relative z-10 capitalize">{category.name}</span>
    </Link>
  );
};

export default memo(CategoryLink);
