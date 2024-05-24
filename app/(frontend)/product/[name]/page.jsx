import Image from "next/image";
import image7 from "@/public/assets/image7.png";
import image8 from "@/public/assets/image8.png";
import image9 from "@/public/assets/image9.png";
import { oswald } from "@/font";
import Button from "@/components/Button";

export default function page() {
  return (
    <div className={`${oswald.className} flex justify-start px-36`}>
      <div className="flex justify-start items-center mr-10 shrink-0 group-placeholder-shown: basis-1/2">
        <div className="flex flex-col gap-2 mr-3">
          <div className="w-16 h-16">
            <Image
              className="block object-cover w-full h-full"
              src={image7}
              width="100%"
              height="100%"
              alt="Product image"
            />
          </div>
          <div className="w-16 h-16">
            <Image
              className="block object-cover w-full h-full"
              src={image8}
              width="100%"
              height="100%"
              alt="Product image"
            />
          </div>
          <div className="w-16 h-16">
            <Image
              className="block object-cover w-full h-full"
              src={image9}
              width="100%"
              height="100%"
              alt="Product image"
            />
          </div>
        </div>
        <div style={{ width: "550px", height: "550px" }}>
          <Image
            className="block object-cover"
            src={image7}
            width="100%"
            height="100%"
            alt="Product image"
          />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="mb-5 font-bold text-3xl">
          Women Black Checked Fit and Flare Dress
        </h3>
        <div className="mb-4">
          <p className="font-medium text-base mb-2">
            Color: <span>Black</span>
          </p>
          <div className="flex">
            <div className="border-black border-2 rounded-md p-0.5">
              <Image
                className="w-11 h-11 rounded-md"
                src={image9}
                width="100%"
                height="100%"
                alt="Product image"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-medium text-base mb-2">
            Size: <span>M</span>
          </p>
          <div className="flex gap-3 flex-wrap">
            <p className="border py-1 px-2.5">S</p>
            <p className="border py-1 px-2.5">M</p>
            <p className="border py-1 px-2.5">L</p>
            <p className="border py-1 px-2.5">XL</p>
            <p className="border py-1 px-2.5">XXL</p>
            <p className="border py-1 px-2.5">XXXL</p>
            <p className="border py-1 px-2.5">4XL</p>
          </div>
        </div>
        <div className="flex items-center gap-10 mb-4">
          <div className="flex flex-col justtify-center">
            <p className="font-medium text-base mb-2">Quantity</p>
            <div className="w-32 flex justify-center items-center border-2 ">
              <span className="block px-4 text-2xl">-</span>
              <input
                type="text"
                defaultValue={1}
                value={1}
                className="w-8 text-center px-2 outline-none"
              />
              <span className="block px-4 text-2xl">+</span>
            </div>
          </div>
          <div lassName="flex flex-col justify-center">
            <p className="font-medium text-base mb-2">Total</p>
            <p>#50,000</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <Button>Add to Cart</Button>
            <Button>Add to Cart</Button>
          </div>
          <Button>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
