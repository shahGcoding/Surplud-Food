import React from "react";

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto my-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-center mb-10">
        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
      </p>

      <div className="space-y-6">
        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
          <p className="text-gray-600">
            We may collect personal details such as your name, email, phone number, delivery address, 
            payment details, and account information when you register or use our services.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
          <p className="text-gray-600">
            Your information is used to provide and improve our services, process orders, 
            communicate with you, and ensure a safe marketplace for both buyers and sellers.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Sharing of Information</h2>
          <p className="text-gray-600">
            We do not sell or rent your personal information. 
            However, we may share limited details with sellers, delivery partners, or service providers 
            to complete transactions securely.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Data Security</h2>
          <p className="text-gray-600">
            We implement strict security measures to protect your data. 
            However, no system is completely secure, and we cannot guarantee absolute protection from unauthorized access.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Cookies & Tracking</h2>
          <p className="text-gray-600">
            Our platform may use cookies and tracking technologies to enhance your experience, 
            analyze usage, and deliver personalized content.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Your Rights</h2>
          <p className="text-gray-600">
            You have the right to access, update, or delete your personal information. 
            You may also opt out of promotional emails at any time.
          </p>
        </div>

        {/* Section 7 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Updates to Privacy Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. 
            Any changes will be posted here with an updated "Last updated" date.
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

export default PrivacyPolicy;
