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
    revalidate: 10, // 30 seconds
    tags: ['products-all'],
  }
);

export default async function CategoryProducts({ cat, searchParams }) {
  const data = await cachedProducts(cat, searchParams);

  if (!data) {
    notFound();
  }

  return (
    data && (
      <>
        <div className="relative min-h-[80vh]">
          {data && data?.data?.length > 0 ? (
            <ProductList
              products={data.data}
              cat={cat}
              searchParams={searchParams}
              banner={data?.banner}
              totalCount={data?.totalCount}
              currentPage={data?.currentPage}
              limit={data?.limit}
            />
          ) : (
            <div className="flex min-h-[80vh] flex-col items-center justify-center p-8">
              <p className="mb-6 text-center font-roboto text-xl text-grayText">
                No products found.
              </p>
            </div>
          )}
        </div>
        {data?.description && (
          <div className="mx-auto bg-grayBg px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-start text-gray-500">
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </div>
          </div>
        )}
      </>
    )
  );
}
