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
import { LoadingOutlined } from "@ant-design/icons";
import { addToWishlist } from "@/app/action/userAction";
import useConfirmModal from "@/app/ui/confirm-modal";

const CartCard = ({ cartItem }) => {
  const user = useUserStore((state) => state.user);
  const [quantity, setQuantity] = useState(cartItem.quantity.toString());
  const [isLoading, setIsLoading] = useState(false);
  const previousQuantityRef = useRef(cartItem.quantity.toString());
  const showConfirmModal = useConfirmModal();

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
      const updatedCart = await updateCartItemQuantity({
        userId: user.id,
        cartItemId: cartItem.id,
        productId: cartItem.productId,
        quantity: parseInt(newQuantity),
      });
      // Find the updated cart item and set its quantity
      const updatedItem = updatedCart.item.find(
        (item) => item.id === cartItem.id,
      );
      if (updatedItem) {
        setQuantity(updatedItem.quantity.toString());
        previousQuantityRef.current = updatedItem.quantity.toString();
      }
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
    showConfirmModal({
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
          <Spin
            indicator={<LoadingOutlined spin className="!text-primary" />}
            size="large"
          />
        </div>
      )}
      <div className="flex w-full items-start gap-4 py-4">
        <div className="flex items-start space-x-4">
          <input
            type="checkbox"
            checked={cartItem.checked}
            onChange={handleCheckboxChange}
            className="h-5 w-5 cursor-pointer appearance-none border border-gray-300 bg-white checked:border-gray-900 checked:bg-gray-900 checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none"
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
          <div className="flex items-center">
            <span className="mr-4 block text-base font-medium text-gray-700">
              {cartItem.price} NGN
            </span>
            <div className="mr-auto flex flex-wrap items-center gap-2">
              {cartItem?.option &&
                Object.entries(cartItem.option).map(([key, value]) => (
                  <span
                    key={`${key}-${value}`}
                    className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-semibold uppercase text-gray-700 shadow-sm transition-colors duration-200 ease-in-out hover:bg-gray-300"
                  >
                    {value}
                  </span>
                ))}
            </div>

            <div className="ml-auto flex h-10 items-center border border-gray-300 bg-white shadow-sm">
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
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 48 }}
                spin
                className="!text-primary"
              />
            }
            size="large"
          />
        </div>
      )}
      <div className="flex w-full flex-col divide-y divide-gray-300">
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="mr-2 h-5 w-5 cursor-pointer appearance-none border border-gray-300 bg-white checked:border-gray-900 checked:bg-gray-900 checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none"
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
