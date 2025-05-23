'use client';
import Image from 'next/image';
import { ButtonPrimary } from '@/app/components/button';
import { removeFromWishlist } from '@/app/action/userAction';
import { createCartItem } from '@/app/action/cartAction';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { SmallSpinner } from '@/app/components/spinner';
import { CloseOutlined } from '@ant-design/icons';
import { formatToNaira } from '@/app/utils/getFunc';

export default function Wishlist({ product, onRemove }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isRemoving, startRemovingTransition] = useTransition();
  const [isAdding, startAddingTransition] = useTransition();

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  const handleMoveToCart = async () => {
    if (!userId) {
      toast.error('Please login to add to cart');
      return;
    }

    startAddingTransition(async () => {
      try {
        const newItem = {
          product: product.id,
          quantity: 1,
        };

        const result = await createCartItem(userId, newItem);

        if (result?.error) {
          toast.error(result.message || 'Failed to add item to cart');
          throw new Error('Failed to add item to cart');
        }

        try {
          const wishlistResult = await removeFromWishlist(userId, product.id);

          if (wishlistResult?.error) {
            toast.error(
              wishlistResult.message || 'Failed to remove from wishlist'
            );
            return;
          }

          if (onRemove) {
            onRemove(product.id);
          }

          toast.success('Item moved to cart');
        } catch (wishlistError) {
          console.error(
            'Failed to remove from wishlist after adding to cart:',
            wishlistError
          );
          toast.info(
            'Item added to cart, but could not be removed from wishlist'
          );
        }
      } catch (cartError) {
        console.error('Failed to add to cart from wishlist:', cartError);
        toast.error(cartError.message || 'Failed to add item to cart');
      }
    });
  };

  const handleRemoveItem = () => {
    if (!userId) {
      toast.error('Login required');
      return;
    }

    startRemovingTransition(async () => {
      try {
        const result = await removeFromWishlist(userId, product.id);

        if (result?.error) {
          toast.error(result.message || 'Failed to remove from wishlist');
          return;
        }

        if (onRemove) {
          onRemove(product.id);
        }

        toast.success('Product removed from wishlist');
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        toast.error('Failed to remove item from wishlist');
      }
    });
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
          onClick={handleMoveToCart}
          disabled={isAdding}
        >
          {isAdding ? <SmallSpinner className="!text-white" /> : 'Add to Cart'}
        </ButtonPrimary>
        <button
          className="absolute right-2 top-2 flex-shrink-0 rounded-full transition-colors duration-300"
          onClick={handleRemoveItem}
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
