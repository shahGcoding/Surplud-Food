import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react"; // for hamburger icon

function Header() {
  const navigate = useNavigate();
  const { status: authStatus, userData } = useSelector((state) => state.auth);
  const role = userData?.role;

  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Orders", slug: "/buyer/orders", active: authStatus && role === "buyer" },
    { name: "About us", slug: "/aboutus", active: true },
    { name: "Sign In /SignUp", slug: "/login", active: !authStatus },
    { name: "verify", slug: "/verify-email", active: !authStatus },
    { name: "Dashboard", slug: "/seller/dashboard", active: authStatus && role === "seller" },
    { name: "mainDashboard", slug: "/admin/maindashboard", active: authStatus && role === "admin" },
  ];

  return (
    <header className="py-2 bg-green-500/75 text-white sticky top-0 left-0 w-full backdrop-blur-md shadow-sm z-50">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex space-x-4">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.slug);
                    }}
                    className="inline-block px-4 py-2 duration-300 hover:bg-green-600 hover:cursor-pointer hover:scale-110 rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
          </ul>

          {/* Right Side (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {authStatus && role === "buyer" && <LogoutBtn />}
            {authStatus && role === "seller" && (
              <Link
                to="/seller/profile"
                className="text-xl hover:scale-110 transition-transform"
              >
                👤
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-green-600 text-white rounded-lg mt-2 p-4 space-y-4">
            {navItems.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.slug);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-green-700 rounded-md"
                >
                  {item.name}
                </button>
              ) : null
            )}

            {/* Right Side (Mobile) */}
            <div className="mt-4 flex flex-col space-y-3">
              {authStatus && role === "buyer" && <LogoutBtn />}
              {authStatus && role === "seller" && (
                <Link
                  to="/seller/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-xl hover:scale-110 transition-transform"
                >
                  👤
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
