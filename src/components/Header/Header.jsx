import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {

  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const role = localStorage.getItem("role");

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true
    },
    // {
    //   name: 'Signup',
    //   slug: "/signup",
    //   active: !authStatus,
    // },
    // {
    //   name: 'All Posts',
    //   slug: "/all-posts",
    //   active: authStatus,
    // },
    // {
    //   name: 'Add Post',
    //   slug: "/add-post",
    //   active: authStatus && role === "seller",
    // },
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
    {
      name: 'Sign In /SignUp',
      slug: "/login",
      active: !authStatus,
    },
  ]

  return (
    <header className='py-2 bg-green-500 text-white sticky top-0 left-0 w-full shadow-md z-50'>    {/*we can use fixed at place of sticky */}
      <Container>
      <nav className='flex mt-0'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px'  />

            </Link>
          </div>
          <ul className='flex ml-50 mt-4'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={(e) =>
                  {
                    e.preventDefault();  
                    navigate(item.slug)
                  }}
                className='inline-block px-6 py-2 duration-300 hover:bg-green-600 transition-transform hover:scale-110 hover:cursor-pointer rounded-full'
                >{item.name}</button>
              </li>
            ) : null
            )}
            {authStatus && role === 'buyer' &&(
              <li className='ml-96'>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header