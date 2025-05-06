import FaqItemClient from '@/app/components/customer-service/FaqItemClient';

const faqData = [
  {
    question: 'What is your return policy?',
    answer:
      'You can return any item within 30 days of purchase, provided it is in its original condition.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes, we ship to over 100 countries. Shipping times and fees vary by location.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you will receive a tracking link via email.',
  },
];

export default function FAQ() {
  return (
    <div className="mx-auto my-10 max-w-2xl rounded-lg bg-white pb-20 pt-10">
      <h2
        className={`py-6 text-center font-oswald text-xl font-bold text-gray-800`}
      >
        Frequently Asked Questions
      </h2>
      <div>
        {faqData.map((item, index) => (
          <FaqItemClient
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}
