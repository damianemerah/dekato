"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";

export default function Filter() {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-10 mr-10 mb-3">
        <div className="flex items-center">
          <h3 className="mr-2">Filter By:</h3>
          <div className="flex items-center gap-1">
            <p>Price</p>
            <div>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="min"
                step={1000}
                onChange={handleChange}
                min={1000}
                className="w-20 p-1 border border-black rounded-md"
              />
            </div>
            <p>-</p>
            <div>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="max"
                step={1000}
                onChange={handleChange}
                className="w-20 p-1 border border-black rounded-md"
              />
            </div>
          </div>
        </div>
        <div className=" flex items-center">
          <h3 className="mr-2">Sort By:</h3>
          <div className="flex items-center border border-black px-5 rounded-full">
            <button className="px-4 py-1 font-medium">Best Match</button>
            <button className="px-4 py-1 font-medium border-x border-black">
              Order
            </button>
            <button className="px-4 py-1 font-medium">Price</button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}
