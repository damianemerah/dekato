"use client";
import { useEffect } from "react";
import { useProductStore } from "@/store/store";

import ProductCard from "@/app/ui/ProductCard";

import { getAllProducts } from "../action/productAction";
import { toast } from "react-toastify";

const ProductList = ({ cat, searchParams }) => {
  const setProducts = useProductStore((state) => state.setProducts);
  // const products = useProductStore((state) => state.products);

  const products = [
    {
      id: 1,
      image: "/assets/image3.png",
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "13900.00",
      discount: 30,
    },
    {
      id: 2,
      image: "/assets/image2.png",
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "235.00",
    },
    {
      id: 3,
      image: "/assets/image3.png",
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "90.00",
    },
    {
      id: 4,
      image: "/assets/image2.png",
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "13900.00",
      discount: 30,
    },
    // {
    //   id: 3,
    //   image: "/assets/image3.png",
    //   category: "TOP WOMEN",
    //   name: "Angels malu zip jeans slim black used",
    //   price: "90.00",
    // },
  ];

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
