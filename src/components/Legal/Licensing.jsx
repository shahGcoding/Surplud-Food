import React from "react";

function Licensing() {
  return (
    <div className="max-w-4xl mx-auto my-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Licensing</h1>
      <p className="text-gray-600 text-center mb-10">
        This Licensing Policy outlines the rights, permissions, and restrictions related to the use of our Surplus Food Marketplace platform.
      </p>

      <div className="space-y-6">
        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Platform Usage License</h2>
          <p className="text-gray-600">
            By creating an account, you are granted a limited, non-exclusive, and non-transferable license to use our platform for buying and selling surplus food items, subject to compliance with our Terms and Conditions.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Restrictions</h2>
          <p className="text-gray-600">
            You may not copy, modify, distribute, resell, or exploit any part of the platform without written permission. 
            Unauthorized activities may result in suspension or legal action.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Seller License</h2>
          <p className="text-gray-600">
            Sellers are responsible for ensuring they hold the necessary food safety certifications or business licenses (if required by law) 
            before listing surplus food on the platform. The platform is not liable for seller non-compliance.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Intellectual Property</h2>
          <p className="text-gray-600">
            All trademarks, logos, designs, and software related to this platform remain the intellectual property of the platform owners. 
            Users are not granted rights to use these for commercial purposes without approval.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Third-Party Services</h2>
          <p className="text-gray-600">
            The platform may integrate third-party services (e.g., payment gateways, delivery providers). 
            These services have their own licensing terms, which users must comply with.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Termination of License</h2>
          <p className="text-gray-600">
            We reserve the right to suspend or terminate your license to use the platform at any time if you violate our policies or misuse the service.
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

export default Licensing;
