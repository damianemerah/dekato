"use client";

import { useState } from "react";

const faqData = [
  {
    question: "What is your return policy?",
    answer:
      "You can return any item within 30 days of purchase, provided it is in its original condition.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to over 100 countries. Shipping times and fees vary by location.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you will receive a tracking link via email.",
  },
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <svg
          className={`h-6 w-6 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
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
};

const FAQ = () => {
  return (
    <div className="mx-auto my-10 max-w-2xl rounded-lg bg-white pb-20 pt-10">
      <h2
        className={`py-6 text-center font-oswald text-xl font-bold text-gray-800`}
      >
        Frequently Asked Questions
      </h2>
      <div>
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
