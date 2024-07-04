import React from "react";

export default function Address() {
  return (
    <div>
      <h1 className="font-semibold text-2xl px-4 py-2 border-b border-b-gray-100 mb-1">
        Shipping Address
      </h1>
      <div>
        <div>
          <p className="text-xs mb-2">Default Shipping Address</p>
          <p>John Doe</p>
          <p>1234 Main St</p>
          <p>Springfield, IL 62701</p>
          <p>+234 7066765698</p>
          <button>Change</button>
        </div>
      </div>
    </div>
  );
}
