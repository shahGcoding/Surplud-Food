import React from "react";

const testimonials = [
  {
    name: "Ahmed Raza",
    role: "Buyer",
    review:
      "I was able to buy good quality leftover food at a very low price. Great experience!",
    rating: 5,
  },
  {
    name: "Usman Catering Services",
    role: "Seller",
    review:
      "This platform helped me reduce food waste after events. Highly recommend!",
    rating: 4,
  },
  {
    name: "Maria Khan",
    role: "Buyer",
    review:
      "Very user-friendly and affordable. The food was fresh and delivery was quick!",
    rating: 5,
  },
];

const StarRating = ({ count }) => {
  return (
    <div className="text-yellow-500">
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>★</span>
      ))}
      {Array.from({ length: 5 - count }, (_, i) => (
        <span key={i} className="text-gray-300">★</span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all"
            >
              <p className="text-gray-700 mb-4">"{t.review}"</p>
              <StarRating count={t.rating} />
              <div className="mt-4">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
