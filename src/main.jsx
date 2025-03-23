import React from 'react'
import ReactDom from 'react-dom/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { About, AuthLayout, Login } from './components/index.js'
import Signup from './pages/Signup.jsx'
import AllPosts from './pages/AllPosts.jsx'
import AddPost from './pages/AddPost.jsx'
import EditPost from './pages/EditPost.jsx'
import Post from './pages/Post.jsx'
import ContactUs from './pages/Contactus.jsx'
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import AdminDashboard from "./pages/AdminDashboard"; // Create this page
import SellerDashboard from "./pages/SellerDashboard"; // Create this page


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: '/contactus',
        element: (
          
            <ContactUs/>
          
        )

      },
      {
        path: '/aboutus',
        element: (
          
            <About />
          
        )

      },
      {
        path: '/all-posts',
        element: (
          <AuthLayout authentication={false}>
            {" "}
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: '/add-post',
        element: (
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: '/edit-post/:slug',
        element: (
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: '/post/:slug',
        element: <Post/>,
      },
      {
        path: "/admin-dashboard",
        element: (
          
            <AdminDashboard />
         
        ),
      },
      {
        path: "/seller-dashboard",
        element: (
         
            <SellerDashboard />
          
        ),
      },
    ],
  },
])

 ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
