import Image from "next/image";
import image7 from "@/public/assets/image7.png";
import image8 from "@/public/assets/image8.png";
import image9 from "@/public/assets/image9.png";
import x from "@/public/assets/icons/twitter.svg";
import fb from "@/public/assets/icons/facebook.svg";
import insta from "@/public/assets/icons/instagram.svg";
import whatsapp from "@/public/assets/icons/whatsapp.svg";
import { oswald } from "@/font";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export default function page() {
  return (
    <div className={`${oswald.className} px-40 mb-10 mt-8`}>
      <div className="flex justify-start mb-20">
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
          <div>
            <div
              className="w-full h-auto"
              style={{ width: "550px", height: "550px" }}
            >
              <Image
                className="block object-cover content-normal w-full h-full"
                src={image7}
                width="100%"
                height="100%"
                alt="Product image"
              />
            </div>
            <div className="flex items-center justify-center gap-5 mt-1">
              <p className="font-semibold">Share:</p>
              <Image src={x} width={20} height={20} alt="icon" />
              <Image src={fb} width={14.5} height={14.5} alt="icon" />
              <Image src={insta} width={20} height={20} alt="icon" />
              <Image src={whatsapp} width={20} height={20} alt="icon" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="mb-5 font-normal text-3xl">
            Women Black Checked Fit and Flare Dress
          </h3>
          <div className="mb-6">
            <p className="font-medium text-base mb-2">
              Color: <span>Black</span>
            </p>
            <div className="flex gap-2 items-center">
              <div className="border-black border-2 rounded-md p-0.5">
                <Image
                  className="w-11 h-11 rounded-md"
                  src={image9}
                  width="100%"
                  height="100%"
                  alt="Product image"
                />
              </div>
              <div className="rounded-md p-0.5">
                <Image
                  className="w-11 h-11 rounded-md"
                  src={image9}
                  width="100%"
                  height="100%"
                  alt="Product image"
                />
              </div>
              <div className="rounded-md p-0.5">
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
          <div className="mb-6">
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
          <div className="flex items-center gap-10 mb-6">
            <div className="flex flex-col justtify-center">
              <p className="font-medium text-base mb-2">Quantity</p>
              <div className="grid grid-cols-3 grid-rows-1 border-2 ">
                <button className="block px-4 text-2xl">-</button>
                <input
                  type="text"
                  defaultValue={1}
                  className="w-12 text-center px-2 outline-none border-l border-r"
                />
                <button className="block px-4 text-2xl">+</button>
              </div>
            </div>
            <div lassName="flex flex-col justify-center">
              <p className="font-medium text-base mb-2">Total</p>
              <p className="font-semibold">50,000 EUR</p>
            </div>
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-2">
            <button className="bg-black text-white font-bold py-3 px-9">
              Add to Cart
            </button>
            <button className="font-bold py-3 px-9 border-2">
              Add to Cart
            </button>
            <button className="flex justify-center items-center font-bold py-3 px-9 col-span-2 border-2 border-green-600">
              <Image
                src={whatsapp}
                width="100%"
                height="100%"
                alt="Product image"
              />
              <span className="ml-2">Contact us on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
      <ProductDetail />
      <div className="mt-10">
        <h3 className="pb-4">You May Also Like</h3>
        <div className="flex">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </div>
  );
}
