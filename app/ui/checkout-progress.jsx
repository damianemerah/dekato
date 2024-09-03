import React from "react";

const CheckoutProgress = ({ step }) => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="mr-12 flex flex-col items-center justify-center gap-2">
        <div className="relative flex items-center justify-center rounded-full border-[6px] border-blue-500 p-1 before:absolute before:right-full before:block before:h-[6px] before:w-20 before:bg-blue-500 after:absolute after:left-full after:block after:h-[6px] after:w-20 after:bg-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#303030"
          >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </div>
        <p>Shipping</p>
      </div>
      <div className="ml-12 flex flex-col items-center justify-center gap-2">
        <div
          className={`relative flex items-center justify-center rounded-full border-[6px] p-1 before:absolute before:right-full before:block before:h-[6px] before:w-20 after:absolute after:left-full after:block after:h-[6px] after:w-20 ${step === 2 ? "border-blue-500 before:bg-blue-500 after:bg-blue-500" : "border-gray-300 before:bg-gray-300 after:bg-gray-300"}`}
        >
          <span className="h-6 w-6 rounded-full text-center">2</span>

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#303030"
          >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg> */}
        </div>
        <p>Review & Payment</p>
      </div>
    </div>
  );
};

export default CheckoutProgress;
