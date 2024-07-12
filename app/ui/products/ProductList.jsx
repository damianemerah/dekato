"use client";
import { useEffect } from "react";
import { useProductStore } from "@/store/store";
import ProductCard from "../ProductCard";

const ProductList = ({ cat }) => {
  const setProducts = useProductStore((state) => state.setProducts);
  const products = useProductStore((state) => state.products);
  const isFetched = useProductStore((state) => state.isFetched);

  useEffect(() => {
    if (!isFetched) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/product?cat=${cat}`);
          if (!response.ok) throw new Error("Failed to fetch product data");

          const data = await response.json();
          setProducts(data.data);
          console.log("Products fetched:", data.data);
        } catch (error) {
          console.error("Failed to fetch product data:", error);
        }
      };

      fetchProducts();
    }
  }, [isFetched, setProducts, cat]);

  console.log("Products:", products);

  return (
    <div className="flex flex-wrap justify-center items-center mb-6 bg-gray-100 p-4">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} className="self-stretch" />
      ))}
    </div>
  );
};

export default ProductList;
