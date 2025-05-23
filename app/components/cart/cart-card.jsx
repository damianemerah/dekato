'use client';

import Image from 'next/image';
import DeleteIcon from '@/public/assets/icons/remove.svg';
import {
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemChecked,
  selectAllCart,
} from '@/app/action/cartAction';
import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { InfoCircleOutlined } from '@ant-design/icons';
import { SmallSpinner } from '@/app/components/spinner';
import { useSession } from 'next-auth/react';
import { formatToNaira } from '@/app/utils/getFunc';
import { Checkbox } from '@/app/components/ui/checkbox';

const CartCard = ({ cartItem }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [quantity, setQuantity] = useState(cartItem.quantity.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const previousQuantityRef = useRef(cartItem.quantity.toString());

  const handleCheckboxChange = async () => {
    setIsLoading(true);
    try {
      const result = await updateCartItemChecked(
        userId,
        cartItem.id,
        !cartItem.checked
      );
      if (result?.error) {
        setIsLoading(false);
        toast.error(result.message || 'Failed to update selection');
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const updateQuantity = async (newQuantity) => {
    if (newQuantity === '' || parseInt(newQuantity) < 1) return;

    setIsLoading(true);
    try {
      const updatedCart = await updateCartItemQuantity({
        userId,
        cartItemId: cartItem.id,
        product: cartItem?.product.id,
        variantId: cartItem?.variantId,
        quantity: parseInt(newQuantity),
      });
      if (updatedCart?.error) {
        toast.error(updatedCart.message || 'Failed to update quantity');
        return;
      }
      const updatedItem = updatedCart.item.find(
        (item) => item.id === cartItem.id
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
      if (quantity === '' || parseInt(quantity) < 1) {
        await updateQuantity('1');
      } else {
        await updateQuantity(quantity);
      }
    }
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
          <Checkbox
            checked={cartItem.checked}
            onCheckedChange={handleCheckboxChange}
            className="mr-2 h-5 w-5 cursor-pointer self-center"
          />
          <div className="w-[80px] sm:w-[120px]">
            <Link
              href={`/product/${cartItem?.product?.slug}-${cartItem?.product?.id}`}
            >
              <div className="relative aspect-square w-full sm:aspect-[15/17]">
                <Image
                  src={cartItem.image}
                  alt={cartItem.product.name}
                  fill
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="ml-3 flex h-full min-h-[80px] flex-grow flex-col justify-between gap-2 sm:ml-4 sm:min-h-[120px] sm:gap-3">
          <div className="mb-1 flex h-full items-start justify-between">
            <Link
              href={`/product/${cartItem?.product?.slug}-${cartItem?.product?.id}`}
              className={`mr-2 line-clamp-2 overflow-ellipsis font-oswald text-sm capitalize text-gray-800 hover:opacity-70 sm:text-base`}
            >
              {cartItem?.product?.name}
            </Link>

            <button
              type="button"
              className="rounded-full p-1.5 transition duration-150 ease-in-out hover:bg-gray-100 sm:p-2"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const result = await removeFromCart(userId, cartItem?.id);
                  if (result?.error) {
                    setIsLoading(false);
                    toast.error(result.message || 'Failed to remove item');
                    return;
                  }
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

          <div className="flex items-center justify-between gap-2 sm:flex-row">
            <div className="flex items-center">
              <p className="mr-2 text-xs text-gray-600 sm:mr-3 sm:text-sm">
                Qty:
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
                  value={quantity || ''}
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

            <div className="flex flex-col items-center justify-between sm:flex-col sm:items-end">
              {cartItem.product.isDiscounted && (
                <span className="text-xs text-gray-500 line-through sm:text-sm">
                  {formatToNaira(
                    (cartItem.variantId && cartItem.product.variant.price) ||
                      cartItem.product.price
                  )}
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
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAllChecked(products?.every((product) => product.checked));
  }, [products]);

  const handleSelectAll = async () => {
    setIsLoading(true);
    try {
      const result = await selectAllCart(userId, !isAllChecked);
      if (result?.error) {
        setIsLoading(false);
        toast.error(result.message || 'Failed to update selection');
        return;
      }
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
          <Checkbox
            id="select-all-cart"
            checked={isAllChecked}
            onCheckedChange={handleSelectAll}
            className="mr-2 h-5 w-5 cursor-pointer"
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
