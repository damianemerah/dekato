"use client";

import Image from "next/image";
import image10 from "@/public/assets/image10.png";
import { oswald } from "@/font";
import HeartIcon from "@/public/assets/icons/heart.svg";
import EditIcon from "@/public/assets/icons/edit.svg";
import DeleteIcon from "@/public/assets/icons/delete.svg";

const CartCard = ({ product }) => {
  return (
    <div className="flex w-full flex-col items-center gap-4 py-4 md:flex-row md:items-start md:gap-8">
      <div className="flex items-start">
        <Image
          src={image10}
          alt="product image"
          width={96}
          height={96}
          className="mr-4 h-24 w-24 object-cover"
        />
        <div className="flex flex-col space-y-2">
          <span className={`${oswald.className} font-oswald font-semibold`}>
            Angels malu zip jeans slim black used
          </span>
          <span className="text-gray-500">Red</span>
          <span className="">13000 NGN</span>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-5">
        <div className="flex h-10 items-center border border-grayOutline">
          <button className="px-3 py-1 text-gray-500 hover:bg-gray-100">
            -
          </button>
          <span className="px-4">1</span>
          <button className="px-3 py-1 text-gray-500 hover:bg-gray-100">
            +
          </button>
        </div>
        <p>120,00 EUR</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="bg-grayBg p-2 hover:bg-gray-300">
          <HeartIcon />
        </button>
        <button type="button" className="bg-grayBg p-2 hover:bg-gray-300">
          <EditIcon />
        </button>
        <button type="button" className="bg-grayBg p-2 hover:bg-gray-300">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default function CartCards() {
  // fetch cart and user logic remains the same
  return (
    <div className="flex w-full flex-col divide-y divide-gray-300">
      <CartCard />
      <CartCard />
    </div>
  );
}
