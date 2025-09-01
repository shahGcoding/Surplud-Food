import React from "react";

function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto my-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Terms & Conditions</h1>
      <p className="text-gray-600 text-center mb-10">
        Please read these Terms & Conditions carefully before using our platform.
      </p>

      <div className="space-y-6">
        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By creating an account or using our platform, you agree to comply with these Terms & Conditions. 
            If you do not agree, you may not use our services.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Buyer Responsibilities</h2>
          <p className="text-gray-600">
            Buyers must provide accurate information, respect seller policies, and make timely payments. 
            Misuse of the platform may lead to account suspension.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Seller Responsibilities</h2>
          <p className="text-gray-600">
            Sellers are responsible for ensuring the quality and safety of food listings. 
            Misrepresentation, unsafe food practices, or violations will result in removal or legal action.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Orders & Payments</h2>
          <p className="text-gray-600">
            All orders must be confirmed by sellers. Payments are processed securely, 
            and refunds follow our refund policy. The platform may charge commission on sales.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Delivery & Pickup</h2>
          <p className="text-gray-600">
            Buyers are responsible for providing correct delivery details. 
            Sellers must ensure timely delivery or pickup of food items.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Limitation of Liability</h2>
          <p className="text-gray-600">
            Our platform is a mediator between buyers and sellers. 
            We are not responsible for disputes, quality issues, or damages caused by sellers or buyers.
          </p>
        </div>

        {/* Section 7 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Updates to Terms</h2>
          <p className="text-gray-600">
            These Terms & Conditions may be updated from time to time. 
            Continued use of the platform means you accept any revised terms.
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-sm text-gray-500 mt-10 text-center">
        Last updated: August 2025
      </p>
    </div>
  );
}

export default TermsAndConditions;
