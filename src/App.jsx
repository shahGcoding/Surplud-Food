import React, { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './App.css'
import authService from './appwrite/auth'
import { Header, Footer } from './components'
import {login, logout} from './store/authSlice'
import { Outlet } from 'react-router-dom'


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  const navigate = useNavigate();

useEffect(() => {
  authService
    .getCurrentUser()
    .then((userData) => {
      if (userData) {
        const userRole = userData.prefs?.role || "buyer"; // Default to "buyer" if role is not set
        userData.role = userRole; // Set role in userData for consistency
        dispatch(login(userData));
        localStorage.setItem("role", userRole); // Store role in local storage
        localStorage.setItem("userId", userData.$id);

        // Redirect based on role
        if (userData.prefs?.role === "admin") navigate("/admin-dashboard");
            else if (userData.prefs?.role === "seller") navigate("/seller-dashboard");
            else navigate("/");
      } else {
        dispatch(logout());
      }
    })
    .finally(() => setLoading(false));
}, [navigate]);

 return !loading ? (
  <div className='min-h-screen flex flex-wrap content-between bg-gray-100'>
    <div className='w-full block'>
      <Header />
      <main className='bg-gray-100'>
       {<Outlet />}
      </main>
      <Footer />
    </div>
  </div>
) : null
}

export default App
