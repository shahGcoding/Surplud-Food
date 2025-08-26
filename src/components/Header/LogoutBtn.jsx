import React from 'react'
import { useDispatch } from 'react-redux'
import {logoutUser} from "../../config/config.js"
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logoutHandler = () => {
      logoutUser().then(() =>{
        dispatch(logout())
        navigate('/login')
      })
    }

  return (
    <button className='inline-block px-6 bg-orange-600 text-gray-100 py-2 duration-200 transition-transform hover:scale-110 hover:cursor-pointer rounded-full' onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn