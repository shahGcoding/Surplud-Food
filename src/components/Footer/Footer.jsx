import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Footer() {

    const navigate = useNavigate()

    const quickLinks = [
        {
          name: 'Home',
          slug: '/',
          active: true
        },
        {
          name: 'About us',
          slug: "/aboutus",
          active: true,
        },
      ]

      const Support = [
        {
          name: 'FAQs',
          slug: '/faqs',
          active: true
        },
        {
          name: 'Seller Guideline',
          slug: '/seller-guideline',
          active: true
        },
        {
          name: 'Buyer Support',
          slug: '/buyer-support',
          active: true
        }
      ] 

      const Legal = [
        {
          name: 'Terms & Conditions',
          slug: '/terms-conditions',
          active: true
        },
        {
          name: 'Privacy Policy',
          slug: '/privacy-policy',
          active: true
        },
        {
          name: 'Licensing',
          slug: '/licensing',
          active: true
        }
      ]

  return (
    <footer className="relative overflow-hidden py-10 bg-green-800 text-white border-t-2 border-green-900">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Logo & Copyright */}
          <div>
            <div className="mb-4">
              <Logo width="120px" />
            </div>
            <p className="text-sm text-gray-300">
              Reducing food waste, one meal at a time. Join us in making a difference!
            </p>
            <p className="text-sm text-gray-400 mt-4">&copy; 2025 Surplus Food. All Rights Reserved.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className='space-y-2'>
            {quickLinks.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={(e) =>
                  {
                    e.preventDefault();  
                    navigate(item.slug)
                  }}
                className="text-gray-300 hover:text-gray-100 transition-transform hover:cursor-pointer rounded-md"
                >{item.name}</button>
              </li>
            ) : null
            )}
            
          </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              { Support.map((item) => 
                item.active ? (
                  <li key={item.name}>
                    <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.slug)
                    }}
                    className="text-gray-300 hover:text-gray-100 transition-transform hover:cursor-pointer rounded-md"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )

              }
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              { Legal.map((item) =>
              item.active ? (
                <li key={item.slug}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.slug)
                    }}
                    className="text-gray-300 hover:text-gray-100 transition-transform hover:cursor-pointer rounded-md"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
