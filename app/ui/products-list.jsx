import React from "react";
import ProductCard from "./product-card";

const ProductsList = () => {
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
    {
      id: 3,
      image: "/assets/image3.png",
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "90.00",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
