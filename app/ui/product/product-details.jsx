"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { oswald } from "@/style/font";

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
import { SmallSpinner } from "../spinner";
import useSWR from "swr";
import { getVarOptionById } from "@/app/action/variantAction";
import dynamic from "next/dynamic";
import Image from "next/image";

const CollapsibleSection = dynamic(() => import("./collasible"), {
  loading: () => (
    <div className="border-b border-gray-200 px-2 sm:px-5">
      <div className="flex items-center justify-between py-4">
        <div className="h-4 w-32 animate-pulse bg-gray-200" />
        <div className="h-6 w-6 animate-pulse bg-gray-200" />
      </div>
      <div className="h-20 w-full animate-pulse bg-gray-100" />
    </div>
  ),
  ssr: false,
});

const VariantOptionMap = memo(
  dynamic(() => import("./variant-option"), {
    loading: () => (
      <div className="mb-4">
        <div className="mb-2 h-6 w-32 animate-pulse bg-gray-200" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-16 animate-pulse rounded-full bg-gray-200"
            />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }),
);

const ProductSwiper = memo(
  dynamic(() => import("@/app/ui/product/product-swiper"), {
    loading: () => (
      <div className="relative h-full w-full">
        <div className="absolute left-8 top-8 z-10 flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-16 animate-pulse bg-gray-200" />
          ))}
        </div>
        <div className="h-full w-full animate-pulse bg-gray-100" />
      </div>
    ),
    ssr: false,
  }),
);

const variantFetcher = async (ids) => {
  if (ids.length === 0) return null;
  const data = await Promise.all(ids.map((id) => getVarOptionById(id)));
  return data;
};

const ProductDetail = memo(function ProductDetail({ product }) {
  console.log(product.isDiscounted, "product🚀🚀🚀");
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [hasVariationTypes, setHasVariationTypes] = useState([]);
  const [isProductAvailable, setIsProductAvailable] = useState(true);

  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  const { data: variationList } = useSWR(
    hasVariationTypes.length > 0 ? JSON.stringify(hasVariationTypes) : null,
    () => variantFetcher(hasVariationTypes),
    {
      revalidateOnFocus: false,
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

  const [activeSections, setActiveSections] = useState({});
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleToggleSection = useMemo(
    () => (section) => {
      setActiveSections((prevSections) => ({
        ...prevSections,
        [section]: !prevSections[section],
      }));
    },
    [],
  );

  const handleMouseMove = useMemo(
    () => (e) => {
      if (!isZoomed) return;
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setZoomPosition({ x, y });
    },
    [isZoomed],
  );

  const handleImageClick = useMemo(
    () => () => {
      setIsZoomed(!isZoomed);
    },
    [isZoomed],
  );

  const addItemToCart = useMemo(
    () => async () => {
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
    },
    [userId, isProductAvailable, product, selectedVariantId],
  );

  const addWishlist = useMemo(
    () => async () => {
      try {
        if (!userId) {
          return;
        }

        if (user?.wishlist?.includes(product.id)) {
          await removeFromWishlist(userId, product.id);
        } else {
          await addToWishlist(userId, product.id);
        }
        await mutate(`/api/user/${userId}`);
      } catch (error) {
        console.log(error, "error");
        message.info("Unable to add to wishlist", 4);
      }
    },
    [userId, user?.wishlist, product.id],
  );

  const handleVariantSelection = useMemo(
    () => (optionName, value) => {
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
    },
    [selectedVariantOption, product.variant],
  );

  const isOptionAvailable = useMemo(
    () => (optionName, value) => {
      return product.variant.some(
        (variant) =>
          variant.options[optionName] === value &&
          Object.entries(selectedVariantOption).every(
            ([key, val]) => key === optionName || variant.options[key] === val,
          ),
      );
    },
    [product.variant, selectedVariantOption],
  );

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
        <div className="mb-8 w-screen lg:sticky lg:top-0 lg:mb-0 lg:w-2/3">
          <div className="relative h-[calc(100vh-11.5rem)] w-full lg:h-[calc(100vh-6rem)]">
            <ProductSwiper
              product={product}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
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
            <div className="mb-8 mt-auto space-y-4">
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
                  {user?.wishlist?.includes(product.id) ? (
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
});

export default ProductDetail;
