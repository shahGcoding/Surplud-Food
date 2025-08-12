import React, { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './App.css'
import authService from './appwrite/auth'
import appwriteService from './appwrite/config'
import { Header, Footer } from './components'
import {login, logout} from './store/authSlice'
import { Outlet } from 'react-router-dom'


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  const navigate = useNavigate();

    useEffect(() => {
    const fetchAndStoreUser = async () => {
      try {
        const userData = await authService.getCurrentUser()
        if (userData) {
          const role = await appwriteService.getUserRole(userData.$id)
          const updatedUser = { ...userData, role: role || "buyer" }

          dispatch(login(updatedUser))

          if (userData.prefs?.role === "admin") navigate("/admin-dashboard");
            else if (userData.prefs?.role === "seller") navigate("/seller-dashboard");
            else navigate("/");
      } else {
        dispatch(logout());
      }
       } catch (error) {
        console.error("Failed to fetch user:", error)
        dispatch(logout())
      } finally {
        setLoading(false)
      }
    }

    fetchAndStoreUser()
  }, [navigate, dispatch])


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
