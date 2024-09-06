import Image from "next/image";
import image10 from "@/public/assets/image10.png";
import { oswald } from "@/font";
import React from "react";

const OrderCard = () => {
  return (
    <div className="flex items-center justify-between py-4">
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
      <div className="text-right">
        <span>x2</span>
      </div>
    </div>
  );
};

export default OrderCard;
