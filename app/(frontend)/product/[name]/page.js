import Image from "next/image";
import image7 from "@/public/assets/image7.png";
import image8 from "@/public/assets/image8.png";
import image9 from "@/public/assets/image9.png";
import x from "@/public/assets/icons/twitter.svg";
import fb from "@/public/assets/icons/facebook.svg";
import insta from "@/public/assets/icons/instagram.svg";
import whatsapp from "@/public/assets/icons/whatsapp.svg";
import { oswald } from "@/font";
import ProductDetail from "@/app/ui/product/ProductDetail";
import ProductCard from "@/app/ui/ProductCard";

export default function CategoryPage() {
  return (
    <div className={`${oswald.className} mb-10 mt-8 px-40`}>
      <div className="mb-20 flex justify-start">
        <div className="group-placeholder-shown: mr-10 flex shrink-0 basis-1/2">
          <div className="mr-3 flex flex-col gap-2 self-start">
            <div className="h-16 w-16">
              <Image
                className="block h-full w-full object-cover"
                src={image7}
                width="100%"
                height="100%"
                alt="Product image"
              />
            </div>
            <div className="h-16 w-16">
              <Image
                className="block h-full w-full object-cover"
                src={image8}
                width="100%"
                height="100%"
                alt="Product image"
              />
            </div>
            <div className="h-16 w-16">
              <Image
                className="block h-full w-full object-cover"
                src={image9}
                width="100%"
                height="100%"
                alt="Product image"
              />
            </div>
          </div>
          <div>
            <div
              className="h-auto w-full"
              style={{ width: "550px", height: "550px" }}
            >
              <Image
                className="block h-full w-full content-normal object-cover"
                src={image7}
                width="100%"
                height="100%"
                alt="Product image"
              />
            </div>
            <div className="mt-1 flex items-center justify-center gap-5">
              <p className="font-semibold">Share:</p>
              <Image src={x} width={20} height={20} alt="icon" />
              <Image src={fb} width={14.5} height={14.5} alt="icon" />
              <Image src={insta} width={20} height={20} alt="icon" />
              <Image src={whatsapp} width={20} height={20} alt="icon" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="mb-5 text-3xl font-normal">
            Women Black Checked Fit and Flare Dress
          </h3>
          <div className="mb-6">
            <p className="mb-2 text-base font-medium">
              Color: <span>Black</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="rounded-md border-2 border-black p-0.5">
                <Image
                  className="h-11 w-11 rounded-md"
                  src={image9}
                  width="100%"
                  height="100%"
                  alt="Product image"
                />
              </div>
              <div className="rounded-md p-0.5">
                <Image
                  className="h-11 w-11 rounded-md"
                  src={image9}
                  width="100%"
                  height="100%"
                  alt="Product image"
                />
              </div>
              <div className="rounded-md p-0.5">
                <Image
                  className="h-11 w-11 rounded-md"
                  src={image9}
                  width="100%"
                  height="100%"
                  alt="Product image"
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <p className="mb-2 text-base font-medium">
              Size: <span>M</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <p className="border px-2.5 py-1">S</p>
              <p className="border px-2.5 py-1">M</p>
              <p className="border px-2.5 py-1">L</p>
              <p className="border px-2.5 py-1">XL</p>
              <p className="border px-2.5 py-1">XXL</p>
              <p className="border px-2.5 py-1">XXXL</p>
              <p className="border px-2.5 py-1">4XL</p>
            </div>
          </div>
          <div className="mb-6 flex items-center gap-10">
            <div className="justtify-center flex flex-col">
              <p className="mb-2 text-base font-medium">Quantity</p>
              <div className="grid grid-cols-3 grid-rows-1 border-2">
                <button className="block px-4 text-2xl">-</button>
                <input
                  type="text"
                  defaultValue={1}
                  className="w-12 border-l border-r px-2 text-center outline-none"
                />
                <button className="block px-4 text-2xl">+</button>
              </div>
            </div>
            <div lassName="flex flex-col justify-center">
              <p className="mb-2 text-base font-medium">Total</p>
              <p className="font-semibold">50,000 EUR</p>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <button className="bg-black px-9 py-3 font-bold text-white">
              Add to Cart
            </button>
            <button className="border-2 px-9 py-3 font-bold">
              Add to Cart
            </button>
            <button className="col-span-2 flex items-center justify-center border-2 border-green-600 px-9 py-3 font-bold">
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
          {/* <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard /> */}
        </div>
      </div>
    </div>
  );
}
