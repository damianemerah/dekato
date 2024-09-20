"use client";

import Image from "next/image";
import { oswald } from "@/font";
import HeartIcon from "@/public/assets/icons/heart.svg";
import EditIcon from "@/public/assets/icons/edit.svg";
import DeleteIcon from "@/public/assets/icons/delete.svg";
import {
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemChecked,
  selectAllCart,
} from "@/app/action/cartAction";
import { useUserStore, useCartStore } from "@/store/store";
import { mutate } from "swr";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { message, Spin, Modal } from "antd";
import { addToWishlist } from "@/app/action/userAction";

const CartCard = ({ cartItem }) => {
  const user = useUserStore((state) => state.user);
  const [quantity, setQuantity] = useState(cartItem.quantity.toString());
  const [isLoading, setIsLoading] = useState(false);
  const previousQuantityRef = useRef(cartItem.quantity.toString());

  const handleCheckboxChange = async () => {
    setIsLoading(true);
    try {
      await updateCartItemChecked(user.id, cartItem.id, !cartItem.checked);
      mutate(`/cart/${user.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const updateQuantity = async (newQuantity) => {
    if (newQuantity === "" || parseInt(newQuantity) < 1) return;
    setIsLoading(true);
    try {
      await updateCartItemQuantity({
        userId: user.id,
        cartItemId: cartItem.id,
        productId: cartItem.productId,
        quantity: parseInt(newQuantity),
      });
      mutate(`/cart/${user.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity !== previousQuantityRef.current) {
      if (quantity === "" || parseInt(quantity) < 1) {
        setQuantity("1");
        updateQuantity("1");
      } else {
        updateQuantity(quantity);
      }
      previousQuantityRef.current = quantity;
    }
  };

  const handleMoveToWishlist = () => {
    Modal.confirm({
      title: "Move to Wishlist",
      content:
        "Are you sure you want to move this item to your wishlist and remove it from the cart?",
      onOk: async () => {
        setIsLoading(true);
        try {
          if (!user?.wishlist.includes(cartItem.productId)) {
            await addToWishlist(user.id, cartItem.productId);
          }
          await removeFromCart(user.id, cartItem.id);
          mutate(`/cart/${user.id}`);
          mutate(`/account/wishlist/${user.id}`);
          message.success("Item moved to wishlist and removed from cart");
        } catch (error) {
          message.error("Failed to move item to wishlist");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  return (
    <>
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-10">
          <Spin size="large" />
        </div>
      )}
      <div className="flex w-full items-start gap-4 py-4">
        <div className="flex items-start space-x-4">
          <input
            type="checkbox"
            checked={cartItem.checked}
            onChange={handleCheckboxChange}
            className="h-5 w-5 cursor-pointer"
          />
          <Link href={`/product/${cartItem.slug}-${cartItem.productId}`}>
            <Image
              src={cartItem.image}
              alt={cartItem.name}
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
            />
          </Link>
        </div>
        <div className="flex flex-grow flex-col space-y-2">
          <div className="flex items-start justify-between">
            <span
              className={`${oswald.className} text-lg font-semibold text-gray-800`}
            >
              {cartItem.name}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="rounded-full bg-gray-100 p-2 transition duration-150 ease-in-out hover:bg-gray-200"
                onClick={handleMoveToWishlist}
              >
                <HeartIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                type="button"
                className="rounded-full bg-gray-100 p-2 transition duration-150 ease-in-out hover:bg-gray-200"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await removeFromCart(user.id, cartItem.id);
                    mutate(`/cart/${user.id}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <DeleteIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-gray-700">
              {cartItem.price} NGN
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {cartItem?.option &&
                Object.entries(cartItem.option).map(([key, value]) => (
                  <span
                    key={`${key}-${value}`}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  >
                    {value}
                  </span>
                ))}
            </div>

            <div className="flex h-10 items-center rounded-md border border-gray-300 bg-white shadow-sm">
              <button
                className="px-3 py-1 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100"
                onClick={() => {
                  const newQuantity = Math.max(1, parseInt(quantity) - 1);
                  setQuantity(newQuantity.toString());
                  updateQuantity(newQuantity.toString());
                }}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onBlur={handleQuantityBlur}
                className="w-12 text-center font-medium focus:outline-none"
              />
              <button
                className="px-3 py-1 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100"
                onClick={() => {
                  const newQuantity = parseInt(quantity) + 1;
                  setQuantity(newQuantity.toString());
                  updateQuantity(newQuantity.toString());
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function CartCards({ products }) {
  const user = useUserStore((state) => state.user);
  const [selectAll, setSelectAll] = useState(false);
  const setCart = useCartStore((state) => state.setCart);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectAll(products?.every((product) => product.checked));
  }, [products]);

  const handleSelectAll = async () => {
    setIsLoading(true);
    try {
      const newSelectAllState = !selectAll;
      const cart = await selectAllCart(user.id, newSelectAllState);
      mutate(`/cart/${user.id}`);
      setCart(cart.item);
    } catch (error) {
      message.info(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-10">
          <Spin size="large" />
        </div>
      )}
      <div className="flex w-full flex-col divide-y divide-gray-300">
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="mr-2 h-5 w-5 cursor-pointer"
          />
          <span className="text-sm font-medium">Select All</span>
        </div>
        {products?.map((product) => (
          <CartCard key={product.id} cartItem={product} />
        ))}
      </div>
    </>
  );
}
