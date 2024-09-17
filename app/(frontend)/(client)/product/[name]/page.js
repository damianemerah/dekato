import ProductDetail from "@/app/ui/product/product-details";
import ProductsList from "@/app/ui/products-list";
import { oswald } from "@/style/font";

export default function CategoryPage({ params: { name } }) {
  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <ProductDetail name={name} />
      </div>

      <div className="mb-10 mt-20 px-10">
        <h3 className={`${oswald.className} p-6 pt-9 text-3xl`}>
          You May Also Like
        </h3>

        {/* <ProductsList /> */}
        {/* recommentedproducts here */}
      </div>
    </div>
  );
}
