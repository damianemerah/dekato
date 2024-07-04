"use client";
import { useState } from "react";

export default function Filter() {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
  };

  return (
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
        <select
          className="border border-gray-950 p-2 rounded-full"
          name="sortBy"
          id="sortBy"
        >
          <option className="p-2" value="name selected">
            Relevance
          </option>
          <option className="p-2" value="name">
            Most recent
          </option>
          <option className="p-2" value="price">
            Price low to high
          </option>
          <option className="p-2" value="name">
            Price high to low
          </option>
        </select>
      </div>
    </div>
  );
}
