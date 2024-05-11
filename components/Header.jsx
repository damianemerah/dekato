import Image from "next/image";
import Link from "next/link";
import menu from "@/public/assets/icons/menu.png";
import search from "@/public/assets/icons/search.png";
import favorite from "@/public/assets/icons/favorite.png";
import person from "@/public/assets/icons/person.png";
import bag from "@/public/assets/icons/shopping_bag.png";
import logo from "@/public/assets/icons/dekato.png";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-12 py-3 text-white bg-black max-md:flex-wrap max-md:px-5">
      <div className="flex gap-10 justify-between items-center py-1 text-sm font-medium uppercase whitespace-nowrap mr-40">
        <Image
          alt="cat"
          loading="lazy"
          width={100}
          height={100}
          src={menu}
          className="shrink-0 self-stretch w-8 aspect-square"
        />
        <Image
          alt="cat"
          width="100%"
          height="100%"
          loading="lazy"
          src={logo}
          className="shrink-0 self-stretch my-auto max-w-full aspect-[5] fill-white w-[101px]"
        />

        <ul className="flex gap-5">
          <li>Women</li>
          <li>Men</li>
        </ul>
      </div>
      <div class="relative flex flex-1 items-center">
        <input
          type="text"
          placeholder="Search..."
          class="px-4 py-2 rounded-full bg-white text-black outline-none w-full"
        />
        <button type="button">
          <svg
            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-5 justify-between text-xs tracking-normal whitespace-nowrap ml-40">
        <div className="flex flex-col">
          <Image
            alt="cat"
            width="100%"
            height="100%"
            loading="lazy"
            src={person}
            className="self-center"
          />
          <div className="mt-1">LOGIN</div>
        </div>
        <div className="flex flex-col">
          <Image
            alt="cat"
            width="100%"
            height="100%"
            loading="lazy"
            src={favorite}
            className="self-center"
          />
          <div className="mt-1">WISHLIST</div>
        </div>
        <div className="flex flex-col">
          <Image
            width="100%"
            height="100%"
            alt="cat"
            loading="lazy"
            src={bag}
            className="self-cente"
          />
          <div className="mt-1">BAG</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
