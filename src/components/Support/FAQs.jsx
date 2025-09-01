import React, { useState } from "react";

const faqs = [
  {
    question: "What is Surplus Food Marketplace?",
    answer:
      "It is a platform where sellers (restaurants, hotels, marriage halls, etc.) can sell leftover or surplus food at discounted prices, and buyers can purchase affordable meals.",
  },
  {
    question: "How can I register as a buyer or seller?",
    answer:
      "Simply sign up on the platform. During registration, you can choose whether you want to register as a Buyer or Seller. Admins have their own separate login.",
  },
  {
    question: "Is the food safe to eat?",
    answer:
      "Yes, sellers are required to ensure that the listed surplus food is fresh, hygienic, and safe for consumption.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Buyers can pay using the available payment methods. Sellers receive the order amount minus the small commission fee charged by the platform.",
  },
  {
    question: "What if I face an issue with my order?",
    answer:
      "You can contact the seller directly through the messaging system or raise a complaint via your dashboard.",
  },
];

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <span className="ml-2">{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQs;
