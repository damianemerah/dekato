'use client';
import Image from 'next/image';
import { ButtonPrimary } from '@/app/components/button';
import { removeFromWishlist } from '@/app/action/userAction';
import { createCartItem } from '@/app/action/cartAction';
import { mutate } from 'swr';
import { message } from 'antd';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { SmallSpinner } from '@/app/components/spinner';
import { CloseOutlined } from '@ant-design/icons';
import { formatToNaira } from '@/utils/getFunc';

export default function Wishlist({ product }) {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  const addToCart = async () => {
    try {
      if (!userId) {
        message.error('Please login to add to cart');
        return;
      }
      setIsAdding(true);
      const newItem = {
        product: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image[0],
        userId,
      };

      await createCartItem(userId, newItem);
      await removeFromWishlist(userId, product.id);
      await mutate(`/api/user/${userId}`);
      await mutate(`/cart/${userId}`);
      message.success('Item added to cart');
    } catch (error) {
      message.info(error.message, 4);
    } finally {
      setIsAdding(false);
    }
  };

  const removeItem = async () => {
    try {
      setIsRemoving(true);
      await removeFromWishlist(user.id, product.id);
      await mutate(`/account/wishlist/${user.id}`);
      message.success('Product removed from wishlist');
    } catch (error) {
      console.error(error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="mb-0.5">
      <div className="relative flex h-full flex-col bg-white text-center transition-all duration-300 hover:shadow-md">
        <Link href={`/product/${product.slug}-${product.id}`}>
          <div className="relative w-full overflow-hidden pb-[133.33%]">
            <Image
              src={product.image[0] || '/placeholder-image.jpg'}
              alt={product.name}
              fill={true}
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="absolute left-0 top-0 h-full w-full object-cover object-center"
            />
            {product.discount > 0 && (
              <div className="absolute bottom-3 left-0 bg-green-500 px-2.5 py-1 text-[13px] text-white">
                -{product.discount}%
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center pb-2.5 pt-1 text-[13px]">
            <p className="mb-0.5 w-full truncate overflow-ellipsis whitespace-nowrap text-nowrap text-sm capitalize">
              {product.name}
            </p>
            <div className="mb-1">
              {product.discount ? (
                <div className="flex items-center justify-center gap-2">
                  <p className="font-medium text-gray-500 line-through">
                    {formatToNaira(product.price)}
                  </p>
                  <p className="font-medium text-[#12A100]">
                    {formatToNaira(discountedPrice)}
                  </p>
                </div>
              ) : (
                <p className="font-medium">{formatToNaira(product.price)}</p>
              )}
            </div>
          </div>
        </Link>
        <ButtonPrimary
          className="relative w-full bg-primary py-2 font-oswald text-sm uppercase tracking-wider transition-colors duration-300 hover:bg-opacity-70"
          onClick={addToCart}
          disabled={isAdding}
        >
          {isAdding ? <SmallSpinner className="!text-white" /> : 'Add to Cart'}
        </ButtonPrimary>
        <button
          className="absolute right-2 top-2 flex-shrink-0 rounded-full transition-colors duration-300"
          onClick={removeItem}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <SmallSpinner className="!text-primary !text-opacity-50" />
          ) : (
            <CloseOutlined className="rounded-full bg-secondary/10 p-1 text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
}
