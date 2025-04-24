import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Footer() {

    const navigate = useNavigate()

    const foterItems = [
        {
          name: 'Home',
          slug: '/',
          active: true
        },
        {
          name: 'Contact us',
          slug: "/contactus",
          active: true,
        },
        {
          name: 'About us',
          slug: "/aboutus",
          active: true,
        },
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
            {foterItems.map((item) => 
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
              <li>
                <Link className="text-gray-300 hover:text-gray-100" to="/faq">
                  FAQs
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-gray-100" to="/seller-guidelines">
                  Seller Guidelines
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-gray-100" to="/customer-support">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-300 hover:text-gray-100" to="/terms">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-gray-100" to="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-gray-100" to="/licensing">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
