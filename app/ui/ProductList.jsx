"use client";
import { useEffect } from "react";
import { useProductStore } from "@/store/store";

import ProductCard from "@/app/ui/ProductCard";

import { getAllProducts } from "../action/productAction";
import { toast } from "react-toastify";

const ProductList = ({ cat, searchParams }) => {
  const setProducts = useProductStore((state) => state.setProducts);
  const products = useProductStore((state) => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getAllProducts(cat, searchParams);
        setProducts(productData);
      } catch (error) {
        toast.error("Error fetching products: " + error.message);
        console.log(error);
      }
    };

    fetchProducts();
  }, [setProducts, cat, searchParams]);

  return (
    <>
      {products.map((product, index) => (
        <ProductCard key={index} product={product} className="self-stretch" />
      ))}
    </>
  );
};

export default ProductList;
