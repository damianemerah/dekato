"use client";

import { useState, useRef } from "react";
import { oswald } from "@/font";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import XIcon from "@/public/assets/icons/twitter.svg";
import FbIcon from "@/public/assets/icons/facebook-share.svg";
import InstaIcon from "@/public/assets/icons/instagram-share.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import { Button, ButtonPrimary } from "@/app/ui/button";

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => {
  const contentRef = useRef(null);

  return (
    <li className="border-gray-200">
      <button
        className={`${oswald.className} flex w-full justify-between px-2 py-4 text-left text-sm font-medium focus:outline-none`}
        onClick={onToggle}
      >
        {title}
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="h-0.5 w-3 bg-black transition-transform duration-300" />
          <span
            className={`absolute h-0.5 w-3 bg-black transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-90"
            }`}
          />
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          height: isOpen ? contentRef.current.scrollHeight : 0,
        }}
      >
        <div className="px-2 pb-4 font-light">{children}</div>
      </div>
    </li>
  );
};

export default function ProductDetail() {
  const product = {
    id: 1,
    category: "TOP WOMEN",
    name: "Women Black Checked Fit and Flare Dress",
    images: ["/assets/image7.png", "/assets/image8.png", "/assets/image9.png"],
    color: "Black",
    sizes: ["S", "M", "L", "XL", "XXL", "4XL"],
    price: "50000.00",
    quantity: 1,
    discount: 30,
  };

  const discountedPrice = product.discount
    ? (product.price * (100 - product.discount)) / 100
    : product.price;

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const handleToggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <>
      <div className="relative mb-20 flex w-full max-w-[960px] justify-center">
        <div className="sticky bottom-0 top-24 float-left h-fit w-[66.64%] px-3">
          <div className="flex">
            {/* Thumbnail Swiper */}
            <div className="mr-3 flex flex-col gap-2 self-start">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={3}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Thumbs]}
                direction="vertical"
                className="h-fit"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} className="!h-14 !w-12">
                    <Image
                      className="block h-full w-full object-cover"
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {/* Main Image Swiper */}
            <div className="relative max-w-lg overflow-hidden">
              <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Thumbs]}
                className="mainSwiper h-full max-w-lg"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      className="block h-full w-full object-cover"
                      src={image}
                      alt={`Main image ${index + 1}`}
                      width={512}
                      height={650}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mt-1 flex items-center justify-center gap-5">
                <p className="font-semibold">Share:</p>
                <XIcon />
                <FbIcon />
                <InstaIcon />
                <WhatsappIcon />
              </div>
            </div>
          </div>
        </div>

        <div className="float-left mt-6 block w-[33.3332%] max-w-80 flex-1 space-y-4 px-3">
          <h3 className="text-2xl font-normal">{product.name}</h3>
          {product.discount && (
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-gray-500 line-through">
                ₦{product.price}
              </p>
              <p className="text-lg font-semibold text-[#12A100]">
                ₦{discountedPrice}
              </p>
            </div>
          )}
          {!product.discount && (
            <p className="text-lg font-semibold">₦{product.price}</p>
          )}

          <div className="">
            <p className={`${oswald.className} mb-2 text-base font-medium`}>
              Color: <span>{product.color}</span>
            </p>
            <div className="flex gap-2">
              <span className="h-8 w-8 rounded-full border border-black bg-red-600 p-1"></span>
              <span className="h-8 w-8 rounded-full border border-black bg-black p-1"></span>
              <span className="h-8 w-8 rounded-full border border-black bg-white p-1"></span>
            </div>
          </div>

          <div className="">
            <p className={`${oswald.className} mb-2 text-base font-medium`}>
              Size:
            </p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size, index) => (
                <p
                  key={index}
                  className="texy-sm flex h-10 w-10 items-center justify-center border border-black"
                >
                  {size}
                </p>
              ))}
            </div>
          </div>

          <div className={`${oswald.className} space-y-2 pt-2`}>
            <div className="flex items-center justify-center gap-2">
              <ButtonPrimary className="w-full flex-1">
                Add to bag
              </ButtonPrimary>
              <button className="flex h-10 w-10 flex-none items-center justify-center border-2 border-black p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#303030"
                >
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                </svg>
              </button>
            </div>
            <Button className="flex h-[44px] w-full items-center justify-center border-2 border-green-500 px-9 uppercase hover:bg-transparent hover:text-green-500">
              <WhatsappIcon />
              <span className="ml-2">Order on WhatsApp</span>
            </Button>
          </div>

          <div>
            <ul className="divide-y">
              <CollapsibleSection
                title="Product Details"
                isOpen={activeSection === "Product Details"}
                onToggle={() => handleToggleSection("Product Details")}
              >
                <p>
                  Cool off-duty look Black checked dress, has a round neck,
                  three-quarter sleeves, concealed zip closure, an attached
                  lining, and flared hem. Wear this dress to any occasion, and
                  look elegant!
                </p>
              </CollapsibleSection>

              <CollapsibleSection
                title="Brand"
                isOpen={activeSection === "Brand"}
                onToggle={() => handleToggleSection("Brand")}
              >
                <p className={``}>
                  A brand known for its unique styles and comfortable fits.
                </p>
              </CollapsibleSection>

              <CollapsibleSection
                title="Size & Fit"
                isOpen={activeSection === "Size & Fit"}
                onToggle={() => handleToggleSection("Size & Fit")}
              >
                <p className={``}>
                  Model&apos;s height: 172.5cm / 5&apos; 8&quot;
                  <br />
                  Model is wearing: XS - UK 8
                </p>
              </CollapsibleSection>

              <CollapsibleSection
                title="Delivery & Returns"
                isOpen={activeSection === "Delivery & Returns"}
                onToggle={() => handleToggleSection("Delivery & Returns")}
              >
                <p>
                  We deliver your order within 1-2 business days. Easy returns
                  available.
                </p>
              </CollapsibleSection>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
