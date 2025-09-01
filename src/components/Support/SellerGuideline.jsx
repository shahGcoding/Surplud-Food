import React from "react";

function SellerGuideline() {
  const guidelines = [
    {
      title: "Food Quality & Safety",
      description:
        "Always ensure the surplus food you list is fresh, hygienic, and safe for consumption. Expired or spoiled food is strictly prohibited.",
    },
    {
      title: "Clear & Honest Listings",
      description:
        "Provide accurate details such as food type, quantity, expiry time, and pricing. Upload real pictures to build buyer trust.",
    },
    {
      title: "Pricing",
      description:
        "Set reasonable prices for your surplus food. Buyers expect discounted rates compared to regular menu prices.",
    },
    {
      title: "Timely Updates",
      description:
        "Update your listing as soon as items are sold out or unavailable. Keep quantities accurate to avoid cancellation issues.",
    },
    {
      title: "Communication",
      description:
        "Respond promptly to buyer messages and order requests. Good communication improves your seller rating.",
    },
    {
      title: "Order Handling",
      description:
        "Prepare and pack orders properly. Ensure timely delivery or pickup as per your business agreement.",
    },
    {
      title: "Commission & Payments",
      description:
        "The platform charges a small commission per delivered order. Ensure you comply with the payment policies.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto my-10 px-6">
      <h2 className="text-2xl font-bold text-center mb-6">Seller Guidelines</h2>
      <p className="text-center text-gray-600 mb-8">
        Follow these guidelines to maintain trust and ensure smooth operations on our platform.
      </p>

      <div className="space-y-6">
        {guidelines.map((item, index) => (
          <div
            key={index}
            className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerGuideline;
