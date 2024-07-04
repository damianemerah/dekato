import React from "react";
import Link from "next/link";
import CartCard from "@/app/ui/cart/CartCard";

export default function Orders() {
  return (
    <div className="bg-white pb-8 rounded-lg w-full">
      <h1 className="font-semibold text-2xl px-4 py-2 border-b border-b-gray-100 mb-1">
        My orders
      </h1>
      <div className="px-4 pt-3">
        <div className="border border-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center gap-4 border-b border-b-gray-300 pb-2 mb-3">
            <div>
              <h5 className="font-semibold">Status</h5>
              <p className="text-gray-500">Processing</p>
            </div>
            <div>
              <h5 className="font-semibold">Order Number</h5>
              <p className="text-gray-500">#00w73</p>
            </div>
            <div>
              <h5 className="font-semibold">Totol</h5>
              <p className="text-gray-500">$3444</p>
            </div>
            <Link className="mt-4 py-2 p-4 bg-gray-300" href="#">
              View details
            </Link>
          </div>
          <h3>Estimated Delivery: 2nd Feb, 2023</h3>
          <CartCard
            showButton={false}
            showIcon={false}
<<<<<<< HEAD
            className='border-b-0'
=======
            className="border-b-0"
>>>>>>> 8e59308eb818b222de25fd2f15468ce2f523b10e
          />
        </div>
        {/* <div>second card</div> */}
      </div>
    </div>
  );
}
