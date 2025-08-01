import React from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Orders', slug: '/buyer/orders', active: authStatus && role === 'buyer' },
    { name: 'Contact us', slug: '/contactus', active: true },
    { name: 'About us', slug: '/aboutus', active: true },
    { name: 'Sign In /SignUp', slug: '/login', active: !authStatus },
    { name: 'Dashboard', slug: '/seller/dashboard', active: authStatus && role === 'seller' },
  ];

  return (
    <header className='py-2 bg-green-500/75 text-white sticky top-0 left-0 w-full backdrop-blur-md shadow-sm transition-colors duration-300 z-50'>
      <Container>
        <nav className='flex items-center justify-between'>
          {/* Left: Logo */}
          <div className='flex items-center space-x-6'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>

            {/* Nav Items */}
            <ul className='flex space-x-4'>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.slug);
                      }}
                      className='inline-block px-4 py-2 duration-300 hover:bg-green-600 transition-transform hover:scale-110 rounded-full'
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          {/* Right Side */}
          <div className='flex items-center space-x-6'>
            {authStatus && role === 'buyer' && <LogoutBtn />}
            {authStatus && role === 'seller' && (
              <Link to="/seller/profile" className='text-xl hover:scale-110 transition-transform'>
                👤
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
