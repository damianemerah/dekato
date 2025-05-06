'use client';
import { useState } from 'react';

export default function FaqItemClient({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <svg
          className={`h-6 w-6 transform transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-700">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
