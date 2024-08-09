import React from "react";

const SearchBox = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="h-8 bg-white px-4 py-2 text-black outline-none"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 transform"
      >
        <svg
          className="h-5 w-5 text-black"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBox;
