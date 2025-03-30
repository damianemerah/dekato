'use client';
import { ButtonSecondary } from '@/app/components/button';
import Wishlist from '@/app/components/account/wishlist/wishlist';
import { removeFromWishlist } from '@/app/action/userAction';
import { SmallSpinner } from '@/app/components/spinner';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { createCartItem } from '@/app/action/cartAction';
import { mutate } from 'swr';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function WishlistPageClient({ initialWishlistProducts }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isAddingAll, setIsAddingAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialWishlistProducts) {
      setProducts(initialWishlistProducts);
      setIsLoading(false);
    }
  }, [initialWishlistProducts]);

  const addAllToCart = async () => {
    if (!userId) {
      toast.error('Please login to add to cart');
      return;
    }
    setIsAddingAll(true);
    try {
      for (const product of products) {
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image[0],
          userId,
        };
        await createCartItem(userId, newItem);
        await removeFromWishlist(userId, product.id);
      }
      await mutate(`/api/user/${userId}`);
      await mutate(`/cart/${userId}`);
      // Update local state
      setProducts([]);
      toast.success('All items added to cart');
    } catch (error) {
      toast.error('Failed to add all items to cart');
    } finally {
      setIsAddingAll(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );

  if (!products || products.length === 0) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 py-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2 className={`mb-2 font-oswald text-xl font-semibold sm:text-2xl`}>
          Your wishlist is empty
        </h2>
        <p className="mb-4 text-sm text-gray-600 sm:text-base">
          Start adding items to your wishlist to keep track of products you
          love!
        </p>
        <Link href="/">
          <ButtonSecondary
            className={`border-2 border-primary bg-white px-4 py-2 font-oswald text-xs uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white sm:text-sm`}
          >
            Explore Products
          </ButtonSecondary>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="my-6 flex items-center justify-between">
        <h1 className="font-oswald text-xl font-medium uppercase text-gray-700">
          My Wishlist
        </h1>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ButtonSecondary
            className={`bg-grayBg text-grayText w-full border-2 border-secondary px-4 py-2 font-oswald text-xs uppercase transition-colors duration-300 hover:bg-gray-200 hover:text-primary sm:w-auto sm:text-sm`}
            onClick={addAllToCart}
            disabled={isAddingAll}
          >
            {isAddingAll ? (
              <SmallSpinner className="!text-grayText" />
            ) : (
              'Add all to cart'
            )}
          </ButtonSecondary>
          <ButtonSecondary
            className={`bg-grayBg text-grayText w-full border-2 border-secondary px-4 py-2 font-oswald text-xs uppercase transition-colors duration-300 hover:bg-gray-200 hover:text-primary sm:w-auto sm:text-sm`}
          >
            Share Wishlist
          </ButtonSecondary>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
        {products?.map((product) => (
          <Wishlist
            key={product.id}
            product={product}
            onRemove={(productId) => {
              setProducts((prev) => prev.filter((p) => p.id !== productId));
            }}
          />
        ))}
      </div>
    </div>
  );
}
