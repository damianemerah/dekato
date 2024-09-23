"use client";
import React, { useEffect } from "react";
import ProductCard from "./product-card";
import useSWR from "swr";
import { getAllProducts } from "@/app/action/productAction";
import { message } from "antd";
import { useProductStore } from "@/store/store";

const fetcher = async (cat, searchParams) => {
  if (cat === "q") return;
  const productData = await getAllProducts(cat, searchParams);
  console.log(productData, "productData🔥🚀💎");
  return productData;
};

const ProductsList = ({ cat, searchParams }) => {
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const isLoading = useProductStore((state) => state.isLoading);
  const setIsLoading = useProductStore((state) => state.setIsLoading);

  const pCat = cat[0] === "search" ? null : cat;

  const { isLoading: pLoad, error } = useSWR(
    `products/${pCat}:${searchParams}`,
    () => fetcher(pCat, searchParams),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        console.log(data, "data productsList🔥🚀💎");
        setProducts(data);
      },
    },
  );

  useEffect(() => {
    setIsLoading(pLoad);
  }, [pLoad, setIsLoading]);

  if (error) console.log(error, "error🔥🚀💎");

  return (
    <div className="grid grid-cols-4 gap-4">
      {!isLoading &&
        products &&
        products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
    </div>
  );
};

export default ProductsList;
