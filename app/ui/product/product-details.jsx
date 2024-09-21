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
import useSWR, { mutate } from "swr";
import { getProductById } from "@/app/action/productAction";
import { generateVariantOptions } from "@/utils/getFunc";
import { createCartItem } from "@/app/action/cartAction";
import { useUserStore } from "@/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { message, Spin } from "antd";
import { useCartStore } from "@/store/store";

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

const fetcher = async (id) => {
  const product = await getProductById(id);
  return product;
};

export default function ProductDetail({ name }) {
  const [variantOptions, setVariantOptions] = useState([]);
  const [variantImages, setVariantImages] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const id = name.split("-").slice(-1)[0];
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const setCart = useCartStore((state) => state.setCart);

  const { data: product, isLoading } = useSWR(
    `/product/${id}`,
    () => fetcher(id),
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (!product || isLoading) return;
    const discountedPrice = product?.discount
      ? (product.price * (100 - product.discount)) / 100
      : product.price;
    setDiscountedPrice(discountedPrice);

    const options = generateVariantOptions(product.variant);
    setVariantOptions(options);

    // Update this part to create a map of color to image
    const colorToImageMap = new Map();
    product.variant.forEach((variant) => {
      if (variant.options.color && variant.image) {
        colorToImageMap.set(variant.options.color, variant.image);
      }
    });
    setVariantImages(Array.from(colorToImageMap.values()));

    if (product.variant.length > 0) {
      const firstVariant = product.variant[0];
      setSelectedVariantId(firstVariant.id);
      setSelectedVariantOption(firstVariant.options);
    }
  }, [product, isLoading]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const handleToggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
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
        quantity: 1,
        option: selectedVariant?.options || null,
        variantId: selectedVariant?.id || null,
        userId,
      };

      const cartItem = await createCartItem(userId, newItem);
      mutate(`/api/user/${userId}`);
      setCart(cartItem.item);
      message.success("Item added to cart");
      mutate(`/cart/${userId}`);
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
        const wishlistItem = await removeFromWishlist(userId, product.id);
      } else {
        const wishlistItem = await addToWishlist(userId, product.id);
      }
      mutate(`/api/user/${userId}`);
    } catch (error) {
      message.info(error.message);
    }
  };

  const handleVariantSelection = (optionName, value) => {
    setSelectedVariantOption((prev) => ({ ...prev, [optionName]: value }));

    // Filter variants based on the selected color/image
    const filteredVariants = product.variant.filter(
      (variant) => variant.options[optionName] === value,
    );

    // Update other options based on filtered variants
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

    // Find the matching variant and update selectedVariantId
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
    if (optionName === "color") return true; // All colors are selectable
    return product.variant.some(
      (variant) =>
        variant.options[optionName] === value &&
        Object.entries(selectedVariantOption).every(
          ([key, val]) => key === optionName || variant.options[key] === val,
        ),
    );
  };

  if (isLoading) return <div>Loading...</div>;

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
                {product?.image &&
                  product.image.map((image, index) => (
                    <SwiperSlide key={index} className="!h-14 !w-12">
                      <Image
                        className="block h-full w-full object-cover"
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={48}
                        height={56}
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
                {product?.image &&
                  product.image.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative aspect-[4/5] w-full">
                        <Image
                          className="object-cover"
                          src={image}
                          alt={`Main image ${index + 1}`}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
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
          {product.discount > 0 && (
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

          {variantOptions.length > 0 && (
            <div>
              {variantOptions.map((option) => (
                <div key={option.id}>
                  <p
                    className={`${oswald.className} mb-2 text-base font-medium`}
                  >
                    <span className="capitalize">{option.name}</span>:{" "}
                    <span>
                      {selectedVariantOption[option.name] || "Select"}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    {option.values.map((value, index) => {
                      const isAvailable = isOptionAvailable(option.name, value);
                      return option.name === "color" ? (
                        <div
                          key={value}
                          className={`h-16 w-16 rounded-full border ${
                            selectedVariantOption[option.name] === value
                              ? "border-black"
                              : "border-gray-300"
                          } cursor-pointer`}
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
                        </div>
                      ) : (
                        <p
                          key={index}
                          className={`flex items-center justify-center border ${
                            selectedVariantOption[option.name] === value
                              ? "border-black"
                              : "border-gray-300"
                          } p-2 text-xs uppercase ${
                            isAvailable
                              ? "cursor-pointer"
                              : "cursor-not-allowed line-through opacity-50"
                          }`}
                          onClick={() =>
                            isAvailable &&
                            handleVariantSelection(option.name, value)
                          }
                        >
                          {value}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`${oswald.className} space-y-2 pt-2`}>
            <div className="flex items-center justify-center gap-2">
              <ButtonPrimary
                className={`w-full flex-1 ${isAddingToCart ? "cursor-not-allowed" : ""}`}
                onClick={addItemToCart}
              >
                {isAddingToCart ? <Spin /> : "Add to bag"}
              </ButtonPrimary>
              <button
                className="flex h-10 w-10 flex-none items-center justify-center border-2 border-black p-2"
                onClick={addWishlist}
              >
                {user?.wishlist.includes(product.id) ? (
                  <HeartFilledIcon className="text-black" />
                ) : (
                  <HeartIcon />
                )}
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
                <p>{product.description}</p>
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
