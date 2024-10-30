"use client";

import { useState, useRef, useEffect, useMemo, memo } from "react";
import { oswald } from "@/style/font";
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
import { formatToNaira, generateVariantOptions } from "@/utils/getFunc";
import { createCartItem } from "@/app/action/cartAction";
import { useUserStore } from "@/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { message } from "antd";
import CheckmarkIcon from "@/public/assets/icons/check.svg?url";
import { SmallSpinner } from "../spinner";
import useSWR from "swr";
import { getVarOptionById } from "@/app/action/variantAction";

const CollapsibleSection = memo(function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}) {
  const contentRef = useRef(null);

  return (
    <li className="border-b border-gray-200 px-2 sm:px-5">
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
});

const VariantOptionMap = memo(function VariantOptionMap({
  option,
  selectedVariantOption,
  handleVariantSelection,
  isOptionAvailable,
  product,
  variantGroup,
  variationList,
}) {
  const matchingVariation = variationList?.find((v) => v.name === option.name);
  const optionValues = matchingVariation
    ? [...new Set([...matchingVariation.values, ...option.values])]
    : option.values;

  return (
    <div key={option.id} className="mb-4">
      <p className={`mb-2 text-sm font-medium text-gray-700`}>
        <span className="capitalize">{option.name}</span>:{" "}
        <span className="font-bold uppercase">
          {selectedVariantOption[option.name] || "Select"}
        </span>
      </p>
      <div className="flex flex-wrap gap-3">
        {optionValues.map((value, index) => {
          const isAvailable = isOptionAvailable(option.name, value);
          return option.name === "color" ? (
            <div
              key={value}
              className={`border-1 relative h-16 w-16 rounded-full border-secondary ${
                selectedVariantOption[option.name] === value
                  ? "border-2 border-primary"
                  : "border-gray-300"
              } cursor-pointer transition-all duration-200 hover:shadow-md`}
              onClick={() => handleVariantSelection(option.name, value)}
            >
              <Image
                src={
                  product.variant.find((v) => v.options.color === value)
                    ?.image || ""
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
              className={`relative h-10 min-w-[2.5rem] max-w-[4rem] border p-1 text-sm ${
                selectedVariantOption[option.name] === value
                  ? isAvailable
                    ? "border-b-[3px] border-primary text-primary"
                    : "border-b-[3px] border-primary border-b-gray-500 text-primary"
                  : "border-gray-300 text-gray-700"
              } uppercase ${
                !isAvailable
                  ? "border-primary opacity-50 before:absolute before:inset-0 before:left-1/2 before:top-1/2 before:h-[1px] before:w-[130%] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-gray-500 before:opacity-70 before:content-['']"
                  : ""
              } truncate transition-all duration-200`}
              onClick={() => handleVariantSelection(option.name, value)}
              title={value}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
});

const ProductSwiper = memo(function ProductSwiper({
  product,
  activeIndex,
  setActiveIndex,
  thumbsSwiper,
  setThumbsSwiper,
  handleMouseMove,
  handleImageClick,
  isZoomed,
  zoomPosition,
  setZoomPosition,
}) {
  return (
    <>
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
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Thumbs]}
        className="mainSwiper h-full w-full"
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
                    transformOrigin: `${zoomPosition.x * 100}% ${
                      zoomPosition.y * 100
                    }%`,
                    transform: `scale(${isZoomed ? 2 : 1})`,
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
});

const variantFetcher = async (ids) => {
  if (ids.length === 0) return null;
  const data = await Promise.all(ids.map((id) => getVarOptionById(id)));
  return data;
};

export default function ProductDetail({ product }) {
  console.log(product);
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [hasVariationTypes, setHasVariationTypes] = useState([]);
  const [isProductAvailable, setIsProductAvailable] = useState(true);

  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  const { data: variationList, error } = useSWR(
    hasVariationTypes.length > 0 ? JSON.stringify(hasVariationTypes) : null,
    () => variantFetcher(hasVariationTypes),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  if (variationList) console.log(variationList);

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
      const uniqueVariationTypeIds = new Set();
      product.variant.forEach((v) => {
        if (v.optionType) {
          v.optionType.forEach((ot) => {
            if (ot.labelId) {
              uniqueVariationTypeIds.add(ot.labelId);
            }
          });
        }
      });
      setHasVariationTypes(Array.from(uniqueVariationTypeIds).flat());
    }
  }, [product]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeSections, setActiveSections] = useState({});
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleToggleSection = (section) => {
    setActiveSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
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
      if (!isProductAvailable) {
        message.error("This product option is currently unavailable");
        return;
      }
      setIsAddingToCart(true);
      const selectedVariant = product.variant.find(
        (variant) => variant.id === selectedVariantId,
      );
      const newItem = {
        product: product.id,
        quantity: 1,
        option: selectedVariant?.options || null,
        variantId: selectedVariant?.id || null,
      };

      const cartItem = await createCartItem(userId, newItem);
      await mutate(`/api/user/${userId}`);
      await mutate(`/cart/${userId}`);
      await mutate(`/checkout-data`);
      message.success("Item added to cart");
    } catch (error) {
      console.log(error, "error");
      message.info("Unable to add item to cart", 4);
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
      console.log(error, "error");
      message.info("Unable to add to wishlist", 4);
    }
  };

  const handleVariantSelection = (optionName, value) => {
    setSelectedVariantOption((prev) => ({ ...prev, [optionName]: value }));

    const updatedOptions = { ...selectedVariantOption, [optionName]: value };

    const newSelectedVariant = product.variant.find((variant) =>
      Object.entries(updatedOptions).every(
        ([key, val]) => variant.options[key] === val,
      ),
    );

    if (newSelectedVariant) {
      setSelectedVariantId(newSelectedVariant.id);
      setIsProductAvailable(true);
    } else {
      setIsProductAvailable(false);
    }
  };

  const isOptionAvailable = (optionName, value) => {
    return product.variant.some(
      (variant) =>
        variant.options[optionName] === value &&
        Object.entries(selectedVariantOption).every(
          ([key, val]) => key === optionName || variant.options[key] === val,
        ),
    );
  };

  const memoizedVariantOptions = useMemo(() => {
    if (!variantOptions) return [];
    return [
      ...variantOptions.filter(
        (option) => option.name.toLowerCase() === "color",
      ),
      ...variantOptions.filter(
        (option) => option.name.toLowerCase() !== "color",
      ),
    ];
  }, [variantOptions]);

  if (!product)
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-gray-600">
        Product not found
      </div>
    );

  return (
    <div className="relative mx-auto mb-8 w-full">
      <div className="flex flex-col lg:flex-row">
        <div className="mb-8 w-screen lg:sticky lg:top-0 lg:mb-0 lg:h-screen lg:w-2/3">
          <div className="relative h-[calc(100vh-11.5rem)] w-full lg:h-screen">
            <ProductSwiper
              product={product}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              thumbsSwiper={thumbsSwiper}
              setThumbsSwiper={setThumbsSwiper}
              handleMouseMove={handleMouseMove}
              handleImageClick={handleImageClick}
              isZoomed={isZoomed}
              zoomPosition={zoomPosition}
              setZoomPosition={setZoomPosition}
            />
            <div className="mt-4 hidden items-center justify-center gap-6 lg:flex">
              <p className="font-semibold text-gray-700">Share:</p>
              <XIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <FbIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <InstaIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <WhatsappIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
            </div>
          </div>
        </div>

        <div className="no-scrollbar w-full border-b lg:max-h-screen lg:w-1/3 lg:overflow-y-scroll">
          <div className="px-2 sm:px-4 lg:p-5">
            <h3
              className={`${oswald.className} mb-3 text-center text-xl font-[900] uppercase lg:text-left`}
            >
              {product.name}
            </h3>

            <div className="mb-6 text-center lg:text-left">
              {selectedVariantId &&
              product.variant.find((v) => v.id === selectedVariantId)?.price ? (
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  {product.isDiscounted ? (
                    <>
                      <p className="text-gray-500 line-through">
                        {formatToNaira(
                          product.variant.find(
                            (v) => v.id === selectedVariantId,
                          ).price,
                        )}
                      </p>
                      <p className="font-bold text-green-600">
                        {formatToNaira(
                          product.variant.find(
                            (v) => v.id === selectedVariantId,
                          ).price *
                            (1 - product.discount / 100),
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="font-bold">
                      {formatToNaira(
                        product.variant.find((v) => v.id === selectedVariantId)
                          .price,
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  {product.isDiscounted ? (
                    <>
                      <p className="text-gray-500 line-through">
                        {formatToNaira(product.price)}
                      </p>
                      <p className="font-bold text-green-600">
                        {formatToNaira(product.discountPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="font-bold">{formatToNaira(product.price)}</p>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 lg:hidden">
              <p className="font-semibold text-gray-700">Share:</p>
              <XIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <FbIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <InstaIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
              <WhatsappIcon className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800" />
            </div>
            {memoizedVariantOptions.length > 0 && (
              <div className="mb-6">
                {memoizedVariantOptions.map((option) => (
                  <VariantOptionMap
                    key={option.id}
                    option={option}
                    selectedVariantOption={selectedVariantOption}
                    handleVariantSelection={handleVariantSelection}
                    isOptionAvailable={isOptionAvailable}
                    product={product}
                    variationList={variationList}
                  />
                ))}
              </div>
            )}
            <div className="mb-8 space-y-4">
              <p
                className={`text-sm ${isProductAvailable ? "text-green-600" : "text-red-600"}`}
              >
                {isProductAvailable ? "Product is available" : "Out of stock"}
              </p>
              <div className="flex items-center gap-3">
                <ButtonPrimary
                  className={`flex-1 text-sm normal-case ${isAddingToCart || !isProductAvailable ? "cursor-not-allowed opacity-75" : ""} flex items-center justify-center bg-secondary`}
                  onClick={addItemToCart}
                  disabled={isAddingToCart || !isProductAvailable}
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
                  className="flex flex-none items-center justify-center border-2 border-secondary p-2 transition-colors duration-200 hover:bg-gray-100"
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
          </div>
          <div>
            <ul className="divide-y border-t border-gray-200">
              <CollapsibleSection
                title="Product Details"
                isOpen={activeSections["Product Details"]}
                onToggle={() => handleToggleSection("Product Details")}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="quill-content ql-editor"
                />
              </CollapsibleSection>

              <CollapsibleSection
                title="Delivery & Returns"
                isOpen={activeSections["Delivery & Returns"]}
                onToggle={() => handleToggleSection("Delivery & Returns")}
              >
                <p className="text-sm sm:text-base">
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
