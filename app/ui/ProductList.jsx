"use client";
import useSWR from "swr";
import { useProductStore } from "@/store/store";
import { message } from "antd";
import ProductCard from "@/app/ui/ProductCard";
import { getAllProducts } from "@/app/action/productAction";

const ProductList = ({ cat, searchParams }) => {
  const setProducts = useProductStore((state) => state.setProducts);
  const products = useProductStore((state) => state.products);

  const fetcher = async () => {
    try {
      const productData = await getAllProducts(cat, searchParams);
      setProducts(productData);
      return productData;
    } catch (error) {
      message.error("Error fetching products: " + error.message);
      throw error;
    }
  };

  // Use SWR for data fetching
  const { data, error } = useSWR([cat, searchParams], fetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    return <div>Error loading products.</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  } else {
    console.log(data, "data⭐");
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center font-medium">
        No products found.
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center bg-gray-100 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className="self-stretch"
        />
      ))}
    </div>
  );
};

export default ProductList;
