"use client";

import Image from "next/image";
import { oswald } from "@/style/font";
import HeartIcon from "@/public/assets/icons/heart.svg";
import DeleteIcon from "@/public/assets/icons/remove.svg";
import {
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemChecked,
  selectAllCart,
} from "@/app/action/cartAction";
import { mutate } from "swr";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { message } from "antd";
import { addToWishlist } from "@/app/action/userAction";
import useConfirmModal from "@/app/ui/confirm-modal";
import { InfoCircleOutlined } from "@ant-design/icons";
import { SmallSpinner } from "@/app/ui/spinner";
import { useSession } from "next-auth/react";
import { formatToNaira } from "@/utils/getFunc";

const CartCard = ({ cartItem }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [quantity, setQuantity] = useState(cartItem.quantity.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const previousQuantityRef = useRef(cartItem.quantity.toString());
  const showConfirmModal = useConfirmModal();

  const handleCheckboxChange = async () => {
    setIsLoading(true);
    try {
      await updateCartItemChecked(userId, cartItem.id, !cartItem.checked);
      await mutate(`/cart/${userId}`);
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
        userId,
        cartItemId: cartItem.id,
        product: cartItem?.product.id,
        variantId: cartItem?.variantId,
        quantity: parseInt(newQuantity),
      });
      await mutate(`/cart/${userId}`);
      const updatedItem = updatedCart.item.find(
        (item) => item.id === cartItem.id,
      );
      if (updatedItem) {
        setQuantity(updatedItem.quantity.toString());
        previousQuantityRef.current = updatedItem.quantity.toString();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityBlur = async () => {
    if (quantity !== previousQuantityRef.current) {
      if (quantity === "" || parseInt(quantity) < 1) {
        await updateQuantity("1");
      } else {
        await updateQuantity(quantity);
      }
    }
  };

  const handleMoveToWishlist = async () => {
    showConfirmModal({
      title: "Move to Wishlist",
      content: "Move this item to wishlist and remove from cart?",
      onOk: async () => {
        setIsLoading(true);
        try {
          alert(cartItem?.product.id);
          await addToWishlist(userId, cartItem?.product.id);
          await removeFromCart(userId, cartItem.id);
          await mutate(`/cart/${userId}`);
          await mutate(`/account/wishlist/${userId}`);
          await mutate(`/api/user/${userId}`, (user) => ({
            ...user,
            wishlist: [...(user.wishlist || []), cartItem?.product.id],
          }));
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
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
          <SmallSpinner className="!text-primary" />
        </div>
      )}
      <div className="relative flex w-full flex-nowrap items-start border-b border-b-gray-300 bg-white px-3 py-4 text-sm sm:px-4 sm:py-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={cartItem.checked}
            onChange={handleCheckboxChange}
            className="mr-2 h-5 w-5 cursor-pointer appearance-none self-center border border-gray-300 checked:border-gray-900 checked:bg-primary checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none"
          />
          <div className="w-[80px] sm:w-[120px]">
            <div className="relative aspect-square w-full sm:aspect-[15/17]">
              <Image
                src={cartItem.image}
                alt={cartItem.product.name}
                fill
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="ml-3 flex h-full min-h-[80px] flex-grow flex-col justify-between gap-2 sm:ml-4 sm:min-h-[120px] sm:gap-3">
          <div className="mb-1 flex h-full items-start justify-between">
            <Link
              href={`/p/${cartItem?.product?.slug}-${cartItem?.product?.id}`}
              className={`${oswald.className} mr-2 line-clamp-2 overflow-ellipsis text-sm capitalize text-gray-800 hover:opacity-70 sm:text-base`}
            >
              {cartItem?.product?.name}
            </Link>

            <button
              type="button"
              className="rounded-full p-1.5 transition duration-150 ease-in-out hover:bg-gray-100 sm:p-2"
              onClick={async () => {
                setIsLoading(true);
                try {
                  await removeFromCart(userId, cartItem?.id);
                  await mutate(`/cart/${userId}`);
                } finally {
                  setIsLoading(false);
                }
              }}
              aria-label="Remove item"
            >
              <DeleteIcon className="h-4 w-4 text-secondary sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center text-xs sm:text-sm">
            {cartItem?.option &&
              Object.entries(cartItem?.option).map(([key, value]) => (
                <p
                  key={`${key}-${value}`}
                  className="pr-3 capitalize text-[#6c757d]"
                >
                  <span className="mr-1">{key}:</span>
                  <span className="uppercase">{value}</span>
                </p>
              ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <p className="mr-2 text-xs text-gray-600 sm:mr-3 sm:text-sm">
                Quantity:
              </p>
              <div className="flex h-8 items-center border border-primary sm:h-9">
                <button
                  className="px-2 py-1 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100"
                  onClick={() => {
                    const newQuantity = Math.max(1, parseInt(quantity) - 1);
                    updateQuantity(newQuantity.toString());
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity || ""}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  onBlur={handleQuantityBlur}
                  className="w-10 text-center text-sm font-medium [appearance:textfield] focus:outline-none sm:w-12 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  className="px-2 py-1 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100"
                  onClick={() => {
                    const newQuantity = parseInt(quantity) + 1;
                    updateQuantity(newQuantity.toString());
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end">
              {cartItem.product.isDiscounted && (
                <span className="text-xs text-gray-500 line-through sm:text-sm">
                  {formatToNaira(cartItem.product.price)}
                </span>
              )}
              <span className="text-sm font-medium text-primary sm:text-base">
                {formatToNaira(cartItem.currentPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartCards({ products }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(products, "products🚀💎💎");

  useEffect(() => {
    setSelectAll(products?.every((product) => product.checked));
  }, [products]);

  const handleSelectAll = async () => {
    setIsLoading(true);
    try {
      const newSelectAllState = !selectAll;
      const cart = await selectAllCart(userId, newSelectAllState);
      await mutate(`/cart/${userId}`);
    } catch (error) {
      message.info(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
          <SmallSpinner className="!text-primary" />
        </div>
      )}
      <div className="flex w-full flex-col bg-white">
        <div className="mt-2 flex items-center px-4 py-3">
          <input
            type="checkbox"
            id="select-all-cart"
            checked={selectAll !== undefined ? selectAll : false}
            onChange={handleSelectAll}
            className="mr-2 h-5 w-5 cursor-pointer appearance-none border border-gray-300 checked:border-gray-900 checked:bg-gray-900 checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22white%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none"
          />
          <label
            htmlFor="select-all-cart"
            className="text-sm font-medium text-gray-800 hover:opacity-70"
          >
            Select all
          </label>
        </div>
        <div className="bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center border border-primary p-4 text-sm text-gray-600">
            <InfoCircleOutlined className="mr-2 flex-shrink-0 text-lg" />
            <div>
              <strong className="mb-1 block">Items not reserved</strong>
              <p>Checkout now to make them yours</p>
            </div>
          </div>
        </div>
        {memoizedProducts?.map((product) => (
          <CartCard key={product.id} cartItem={product} />
        ))}
      </div>
    </div>
  );
}
