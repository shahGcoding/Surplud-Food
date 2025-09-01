import React from "react";

function BuyerSupport() {
  const supportOptions = [
    {
      title: "Order Issues",
      description:
        "Facing problems with your order? Contact the seller directly through messages or raise a complaint if the issue remains unresolved.",
    },
    {
      title: "Payment Help",
      description:
        "If your payment didn’t go through or you were charged incorrectly, please check your payment history or reach out to our support team.",
    },
    {
      title: "Delivery Delays",
      description:
        "If your order is delayed, check with the seller in the messages section. You can also cancel the order if the seller does not respond in time.",
    },
    {
      title: "General Queries",
      description:
        "For FAQs, please visit our FAQ page. For additional help, you can always contact customer support through the Help Center.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto my-10 px-6">
      <h2 className="text-2xl font-bold text-center mb-6">Buyer Support</h2>
      <p className="text-center text-gray-600 mb-8">
        Need help with your orders, payments, or delivery? Check below for quick support options.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {supportOptions.map((item, index) => (
          <div
            key={index}
            className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default BuyerSupport;
