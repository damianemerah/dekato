"use client";
import { useState } from "react";

export default function Filter() {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
  };

  //  query string /men?min=5000&max=10000&color=red

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex">
        Filter by:
        <div className="flex items-center justify-start">
          <p>Price</p>
          <p>Price</p>
          <p>Price</p>
          <p>Price</p>
        </div>
      </div>
      <div>Sort:</div>
    </div>
  );
}
