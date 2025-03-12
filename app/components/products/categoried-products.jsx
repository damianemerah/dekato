import ProductList from '@/app/components/products/products-list';
import { unstable_cache } from 'next/cache';
import { getAllProducts } from '@/app/action/productAction';
import { notFound } from 'next/navigation';

const cachedProducts = unstable_cache(
  async (cat, searchParams) => {
    const products = await getAllProducts(cat, searchParams);
    return products;
  },
  (cat, searchParams) => [
    `products-${cat.join('-')}-${searchParams.toString()}`,
  ],
  {
    revalidate: 10,
    tags: ['products-all'],
  }
);

export default async function CategoryProducts({ cat, searchParams }) {
  const data = await cachedProducts(cat, searchParams);

  // Only throw notFound for invalid category paths, not for valid categories with no products
  if (!data && cat[0] !== 'search') {
    notFound();
  }

  // Ensure we always have a data object with required properties
  const normalizedData = {
    data: data?.data || [],
    banner: data?.banner || null,
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 1,
    limit: data?.limit || 12,
    description: data?.description || null,
  };

  return (
    <>
      <div className="relative min-h-[80vh]">
        <ProductList
          products={normalizedData.data}
          cat={cat}
          searchParams={searchParams}
          banner={normalizedData.banner}
          totalCount={normalizedData.totalCount}
          currentPage={normalizedData.currentPage}
          limit={normalizedData.limit}
        />
      </div>
      {normalizedData.description && (
        <div className="bg-grayBg mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-start text-gray-500">
            <div
              dangerouslySetInnerHTML={{ __html: normalizedData.description }}
            />
          </div>
        </div>
      )}
    </>
  );
}
