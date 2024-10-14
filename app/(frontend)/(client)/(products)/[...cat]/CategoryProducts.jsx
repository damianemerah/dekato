import SubPageCampaign from "@/app/ui/page-campaign";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import ProductList from "@/app/ui/products-list";
import { unstable_cache } from "next/cache";
import { getAllProducts } from "@/app/action/productAction";
import { notFound } from "next/navigation";

const cachedProducts = unstable_cache(
  async (cat, searchParams) => {
    const products = await getAllProducts(cat, searchParams);
    return products;
  },
  (cat, searchParams) => [
    `products-${cat.join("-")}-${searchParams.toString()}`,
  ],
  {
    revalidate: 10, // 30 seconds
    tags: ["products-all"],
  },
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

        <div
          className={`mb-10 flex items-center justify-center gap-5 bg-primary text-white`}
        >
          <div className="basis-1/2 p-8">
            <SubPageCampaign
              className="border-white text-white"
              heading_bg="after:bg-white before:bg-white text-white"
            />
          </div>

          <div className="block w-1/2 flex-1 self-stretch">
            <Image
              alt="cat"
              className="h-full max-h-full object-cover"
              style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
              loading="lazy"
              src={image6}
            />
          </div>
        </div>
      </>
    )
  );
}
