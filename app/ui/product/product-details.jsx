"use client";

import { useState, useRef, useEffect } from "react";
import { oswald } from "@/font";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import XIcon from "@/public/assets/icons/twitter.svg";
import FbIcon from "@/public/assets/icons/facebook-share.svg";
import HeartIcon from "@/public/assets/icons/heart.svg";
import HeartFilledIcon from "@/public/assets/icons/heart-filled.svg";
import InstaIcon from "@/public/assets/icons/instagram-share.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import { Button, ButtonPrimary } from "@/app/ui/button";
import { mutate } from "swr";
import { generateVariantOptions } from "@/utils/getFunc";
import { createCartItem } from "@/app/action/cartAction";
import { useUserStore } from "@/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { message } from "antd";
import { useCartStore } from "@/store/store";
import CheckmarkIcon from "@/public/assets/icons/check.svg?url";

import { SmallSpinner } from "../spinner";

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => {
  const contentRef = useRef(null);

  return (
    <li className="border-b border-gray-200">
      <button
        className={`${oswald.className} flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-800 hover:text-primary focus:outline-none`}
        onClick={onToggle}
      >
        {title}
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="h-0.5 w-3 bg-gray-600 transition-transform duration-300" />
          <span
            className={`absolute h-0.5 w-3 bg-gray-600 transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-90"
            }`}
          />
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          height: isOpen ? contentRef.current?.scrollHeight : 0,
        }}
      >
        <div className="pb-4 text-sm font-light text-gray-700">{children}</div>
      </div>
    </li>
  );
};

export default function ProductDetail({ product }) {
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    if (!product) return;

    const options = generateVariantOptions(product.variant);
    setVariantOptions(options);

    const colorToImageMap = new Map();
    product.variant.forEach((variant) => {
      if (variant.options.color && variant.image) {
        colorToImageMap.set(variant.options.color, variant.image);
      }
    });

    if (product.variant.length > 0) {
      const firstVariant = product.variant[0];
      setSelectedVariantId(firstVariant.id);
      setSelectedVariantOption(firstVariant.options);
    }
  }, [product]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleToggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomPosition({ x, y });
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const addItemToCart = async () => {
    try {
      if (!userId) {
        message.error("Please login to add to cart");
        return;
      }
      setIsAddingToCart(true);
      const selectedVariant = product.variant.find(
        (variant) => variant.id === selectedVariantId,
      );
      const newItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice || null,
        quantity: 1,
        option: selectedVariant?.options || null,
        variantId: selectedVariant?.id || null,
        userId,
      };

      const cartItem = await createCartItem(userId, newItem);
      await mutate(`/api/user/${userId}`);
      await mutate(`/cart/${userId}`);
      message.success("Item added to cart");
    } catch (error) {
      message.info(error.message, 4);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const addWishlist = async () => {
    try {
      if (!userId) {
        return;
      }

      if (user?.wishlist.includes(product.id)) {
        await removeFromWishlist(userId, product.id);
      } else {
        await addToWishlist(userId, product.id);
      }
      await mutate(`/api/user/${userId}`);
    } catch (error) {
      message.info(error.message);
    }
  };

  const handleVariantSelection = (optionName, value) => {
    setSelectedVariantOption((prev) => ({ ...prev, [optionName]: value }));

    const filteredVariants = product.variant.filter(
      (variant) => variant.options[optionName] === value,
    );

    const updatedOptions = { ...selectedVariantOption, [optionName]: value };
    Object.keys(updatedOptions).forEach((key) => {
      if (key !== optionName) {
        const availableValues = new Set(
          filteredVariants.map((v) => v.options[key]),
        );
        if (!availableValues.has(updatedOptions[key])) {
          updatedOptions[key] = filteredVariants[0].options[key];
        }
      }
    });

    setSelectedVariantOption(updatedOptions);

    const newSelectedVariant = filteredVariants.find((variant) =>
      Object.entries(updatedOptions).every(
        ([key, val]) => variant.options[key] === val,
      ),
    );
    if (newSelectedVariant) {
      setSelectedVariantId(newSelectedVariant.id);
    }
  };

  const isOptionAvailable = (optionName, value) => {
    if (optionName === "color") return true;
    return product.variant.some(
      (variant) =>
        variant.options[optionName] === value &&
        Object.entries(selectedVariantOption).every(
          ([key, val]) => key === optionName || variant.options[key] === val,
        ),
    );
  };

  if (!product)
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-gray-600">
        Product not found
      </div>
    );

  return (
    <div className="mx-auto mb-8 w-full max-w-7xl">
      <div className="flex flex-col lg:flex-row">
        <div className="mb-8 w-full lg:mb-0 lg:w-2/3">
          <div className="relative w-full">
            {product?.image && product.image.length > 1 && (
              <div className="absolute bottom-8 left-8 z-10 md:mb-0">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={3}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Thumbs]}
                  direction="vertical"
                  className="h-64 md:h-auto"
                >
                  {product.image.map((image, index) => (
                    <SwiperSlide
                      key={index}
                      className={`!h-20 !w-16 shadow-shadowSm ${
                        index === activeIndex ? "border-2 border-primary" : ""
                      }`}
                    >
                      <Image
                        className="block h-full w-full object-cover"
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
            <Swiper
              spaceBetween={10}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Thumbs]}
              className="mainSwiper !h-[600px] w-full"
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              {product?.image &&
                product.image.map((image, index) => (
                  <SwiperSlide key={index} className="h-full w-full">
                    <div
                      className="relative h-full w-full overflow-hidden"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setZoomPosition({ x: 0, y: 0 })}
                      onClick={handleImageClick}
                      style={{
                        cursor: `url("data:image/svg+xml,${encodeURIComponent(
                          isZoomed
                            ? '<svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" viewBox="0 0 15 15"><path fill="none" stroke="white" d="M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></svg>'
                            : '<svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" viewBox="0 0 15 15"><path fill="none" stroke="white" d="M7.5 4v7M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></svg>',
                        )}") 24 24, auto`,
                      }}
                    >
                      <Image
                        className="object-cover transition-transform duration-200 ease-out"
                        src={image}
                        alt={`Main image ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={100}
                        style={{
                          transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                          transform: `scale(${isZoomed ? 2 : 1})`,
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
            <div className="mt-4 flex items-center justify-center gap-6">
              <p className="font-semibold text-gray-700">Share:</p>
              <XIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <FbIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <InstaIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <WhatsappIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-4 lg:w-1/3 lg:px-6">
          <h3
            className={`${oswald.className} mb-3 text-center text-xl font-[900] uppercase lg:text-left`}
          >
            {product.name}
          </h3>
          <div className="mb-6 text-center lg:text-left">
            {product.discount > 0 ? (
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <p className="text-gray-500 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="font-bold text-green-600">
                  ₦{product.discountPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="font-bold">₦{product.price.toLocaleString()}</p>
            )}
          </div>

          {variantOptions.length > 0 && (
            <div className="mb-6">
              {variantOptions.map((option) => (
                <div key={option.id} className="mb-4">
                  <p className={`${oswald.className} mb-2 text-lg font-medium`}>
                    <span className="capitalize">{option.name}</span>:{" "}
                    <span className="font-normal">
                      {selectedVariantOption[option.name] || "Select"}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map((value, index) => {
                      const isAvailable = isOptionAvailable(option.name, value);
                      return option.name === "color" ? (
                        <div
                          key={value}
                          className={`border-1 relative h-16 w-16 rounded-full border-secondary ${
                            selectedVariantOption[option.name] === value
                              ? "border-2 border-primary"
                              : "border-gray-300"
                          } cursor-pointer transition-all duration-200 hover:shadow-md`}
                          onClick={() =>
                            handleVariantSelection(option.name, value)
                          }
                        >
                          <Image
                            src={
                              product.variant.find(
                                (v) => v.options.color === value,
                              )?.image || ""
                            }
                            alt={`Variant ${value}`}
                            width={64}
                            height={64}
                            className="h-full w-full rounded-full object-cover"
                          />
                          {selectedVariantOption[option.name] === value && (
                            <CheckmarkIcon className="absolute inset-0 m-auto h-6 w-6 fill-white" />
                          )}
                        </div>
                      ) : (
                        <button
                          key={index}
                          className={`border px-4 py-2 ${
                            selectedVariantOption[option.name] === value
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 text-gray-700"
                          } text-sm uppercase ${
                            isAvailable
                              ? "hover:border-primary hover:bg-primary hover:text-white"
                              : "cursor-not-allowed opacity-50"
                          } transition-all duration-200`}
                          onClick={() =>
                            isAvailable &&
                            handleVariantSelection(option.name, value)
                          }
                          disabled={!isAvailable}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`${oswald.className} mb-8 space-y-4`}>
            <div className="flex items-center gap-3">
              <ButtonPrimary
                className={`flex-1 text-sm normal-case ${isAddingToCart ? "cursor-not-allowed opacity-75" : ""} flex items-center justify-center bg-secondary`}
                onClick={addItemToCart}
                disabled={isAddingToCart}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2.5 h-5 w-5 sm:h-6 sm:w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {isAddingToCart ? (
                  <SmallSpinner className="!text-white" />
                ) : (
                  "Add to Bag"
                )}
              </ButtonPrimary>
              <button
                className="flex flex-none items-center justify-center border border-secondary p-2 transition-colors duration-200 hover:bg-gray-100"
                onClick={addWishlist}
              >
                {user?.wishlist.includes(product.id) ? (
                  <HeartFilledIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            <Button className="group flex h-12 w-full items-center justify-center border-2 border-green-500 px-6 text-green-500 transition-colors duration-200 hover:bg-green-500">
              <WhatsappIcon className="mr-2 h-5 w-5" />
              <span className="text-lg group-hover:text-white sm:text-base md:text-lg">
                Order on WhatsApp
              </span>
            </Button>
          </div>

          <div>
            <ul className="divide-y border-t border-gray-200">
              <CollapsibleSection
                title="Product Details"
                isOpen={activeSection === "Product Details"}
                onToggle={() => handleToggleSection("Product Details")}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="quill-content ql-editor"
                />
              </CollapsibleSection>

              <CollapsibleSection
                title="Delivery & Returns"
                isOpen={activeSection === "Delivery & Returns"}
                onToggle={() => handleToggleSection("Delivery & Returns")}
              >
                <p className="text-sm sm:text-base md:text-lg">
                  We deliver your order within 1-2 business days. Easy returns
                  available within 14 days of delivery.
                </p>
              </CollapsibleSection>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
