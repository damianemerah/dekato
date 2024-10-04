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
    revalidate: 3600,
    tags: ["products-all"],
  },
);

export default async function CategoryProducts({ cat, searchParams }) {
  const products = await cachedProducts(cat, searchParams);

  if (!products) {
    notFound();
  }

  return (
    products && (
      <>
        <div>
          {products && products.length > 0 ? (
            <ProductList
              products={products}
              cat={cat}
              searchParams={searchParams}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
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
              className="border-white"
              heading_bg="after:bg-white before:bg-white"
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
