"use client";
import React from "react";
import ProductCard from "./product-card";
import useSWR from "swr";
import { getAllProducts } from "@/app/action/productAction";
import { message } from "antd";

const fetcher = async (cat, searchParams) => {
  try {
    const productData = await getAllProducts(cat, searchParams);
    console.log(productData, "productData🔥🚀💎");
    return productData;
  } catch (error) {
    message.error("Error fetching products: " + error.message);
    throw error;
  }
};

const ProductsList = ({ cat, searchParams }) => {
  // const products = [
  //   {
  //     id: 1,
  //     image: "/assets/image3.png",
  //     category: "TOP WOMEN",
  //     name: "Angels malu zip jeans slim black used",
  //     price: "13900.00",
  //     discount: 30,
  //   },
  //   {
  //     id: 2,
  //     image: "/assets/image2.png",
  //     category: "TOP WOMEN",
  //     name: "Angels malu zip jeans slim black used",
  //     price: "235.00",
  //   },
  //   {
  //     id: 3,
  //     image: "/assets/image3.png",
  //     category: "TOP WOMEN",
  //     name: "Angels malu zip jeans slim black used",
  //     price: "90.00",
  //   },
  //   {
  //     id: 4,
  //     image: "/assets/image2.png",
  //     category: "TOP WOMEN",
  //     name: "Angels malu zip jeans slim black used",
  //     price: "13900.00",
  //     discount: 30,
  //   },
  //   {
  //     id: 5,
  //     image: "/assets/image3.png",
  //     category: "TOP WOMEN",
  //     name: "Angels malu zip jeans slim black used",
  //     price: "90.00",
  //   },
  //   {
  //     id: 6,
  //     image: "/assets/image2.png",
  //     category: "TOP WOMEN",
  //     name: "Angels malu zip jeans slim black used",
  //     price: "13900.00",
  //     discount: 30,
  //   },
  //   {
  //     id: 7,
  //     image: "/assets/image3.png",
  //     category: "TOP WOMEN",
  //     name: "Angels malu zip jeans slim black used",
  //     price: "90.00",
  //   },
  // ];

  const {
    data: products,
    isLoading,
    error,
  } = useSWR([cat, searchParams], fetcher);

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
