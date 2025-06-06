'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import ProductCard from '@/app/components/products/product-card';
import { Pagination as AntdPagination } from 'antd';
import { LoadingSpinner } from '@/app/components/spinner';
import { productSearch } from '@/app/action/productAction';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientSearch({
  initialProducts,
  totalCount,
  currentPage,
  limit,
  searchQuery,
  searchParams,
}) {
  // Initialize local state from props
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(currentPage);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setProducts(initialProducts);
    setPage(currentPage);
  }, [searchQuery, initialProducts, currentPage]);

  useEffect(() => {
    const currentPageParam = searchParams.page;
    if (!currentPageParam) {
      setPage(1);
    } else {
      const parsed = parseInt(currentPageParam, 10);
      if (!isNaN(parsed)) {
        setPage(parsed);
      }
    }
    if (currentPageParam && parseInt(currentPageParam) === 1) {
      delete searchParams.page;
    }
  }, [searchParams]);

  const handlePageChange = useCallback(
    (newPage) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage);

      setPage(newPage);
      router.push(`${pathname}?${params.toString()}`);

      startTransition(async () => {
        try {
          const { products: newProducts } = await productSearch({
            q: searchQuery,
            page: newPage,
            limit,
          });
          setProducts(newProducts);
        } catch (err) {
          console.error('Failed to fetch products for page', newPage, err);
        }
      });
    },
    [searchParams, pathname, router, searchQuery, limit]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Search Results for &quot;{searchQuery}&quot;
      </h1>

      {/* Show a spinner whenever we're transitioning */}
      {isPending && <LoadingSpinner className="mb-4" />}

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination footer */}
      <div className="my-6 flex justify-center">
        <AntdPagination
          current={page}
          total={totalCount}
          pageSize={limit}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
