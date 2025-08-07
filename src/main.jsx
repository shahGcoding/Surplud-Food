import React from "react";
import ReactDom from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { About, AuthLayout, Complains, Login } from "./components/index.js";
import Signup from "./pages/Signup.jsx";
import AllPosts from "./pages/AllPosts.jsx";
import AddPost from "./pages/AddPost.jsx";
import EditPost from "./pages/EditPost.jsx";
import Post from "./pages/Post.jsx";
import ContactUs from "./pages/Contactus.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import MainDashboard from "./pages/admin/MainDashboard.jsx";
import UserManage from "./pages/admin/UserManage.jsx";
import ListingManage from "./pages/admin/ListingManage.jsx";
import ReportGenerate from "./pages/admin/ReportGenerate.jsx";
import ComplaintHandle from "./pages/admin/ComplaintHandle.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx"; // Create this page
import Listings from "./pages/seller/Listings.jsx";
import Dashboard from "./pages/seller/Dashboard.jsx";
import Order from "./pages/seller/Order.jsx";
import Profile from "./pages/seller/Profile.jsx";
import Message from "./pages/seller/Message.jsx";
import MyListing from "./pages/seller/MyListing.jsx";
import Orders from "./components/Buyer/Orders.jsx"; // Import Orders component
import BuyerComplaint from "./components/Buyer/BuyerComplaint.jsx";
import Complain from "./pages/seller/Complain.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/buyer/buyercomplaint",
        element: (
          <AuthLayout authentication={true}>
            <BuyerComplaint />
          </AuthLayout>
        ),
      },
      {
        path: "/buyer/orders",
        element: (
          <AuthLayout authentication>
            <Orders />
          </AuthLayout>
        ),
      },
      {
        path: "/contactus",
        element: <ContactUs />,
      },
      {
        path: "/aboutus",
        element: <About />,
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication={false}>
            {" "}
            <AllPosts />
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },

      {
        path: "/seller-dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/seller",
        element: (
          <AuthLayout authentication>
            <SellerDashboard />
          </AuthLayout>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "mylisting", element: <MyListing /> },
          { path: "listings", element: <Listings /> },
          { path: "order", element: <Order /> },
          { path: "profile", element: <Profile /> },
          { path: "message", element: <Message /> },
          { path: "complain", element: <Complain /> },
        ],
      },

      {
        path: "/admin-maindashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
        children: [
          { path: "maindashboard", element: <MainDashboard /> },
          { path: "usermanage", element: <UserManage /> },
          { path: "listingmanage", element: <ListingManage /> },
          { path: "complainthandle", element: <ComplaintHandle /> },
          { path: "reportgenerate", element: <ReportGenerate /> },
        ],
      },
    ],
  },
]);

ReactDom.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

// // main.jsx
// import React from 'react'
// import ReactDom from 'react-dom/client'
// import { StrictMode } from 'react'
// import { Provider } from 'react-redux'
// import store from './store/store.js'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import App from './App.jsx'
// import Home from './pages/Home.jsx'
// import { About, AuthLayout, Login } from './components/index.js'
// import Signup from './pages/Signup.jsx'
// import AllPosts from './pages/AllPosts.jsx'
// import AddPost from './pages/AddPost.jsx'
// import EditPost from './pages/EditPost.jsx'
// import Post from './pages/Post.jsx'
// import ContactUs from './pages/Contactus.jsx'
// import PrivateRoute from "./components/PrivateRoute";
// import AdminDashboard from "./pages/AdminDashboard";
// import SellerDashboard from "./pages/seller/Dashboard";
// import Listings from "./pages/seller/Listings";
// import Orders from "./pages/seller/Orders";
// import Profile from "./pages/seller/Profile";
// import Messages from "./pages/seller/Messages";

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       { path: '/', element: <Home /> },
//       { path: '/login', element: <AuthLayout authentication={false}><Login /></AuthLayout> },
//       { path: '/signup', element: <AuthLayout authentication={false}><Signup /></AuthLayout> },
//       { path: '/contactus', element: <ContactUs /> },
//       { path: '/aboutus', element: <About /> },
//       { path: '/all-posts', element: <AuthLayout authentication={false}><AllPosts /></AuthLayout> },
//       { path: '/edit-post/:slug', element: <AuthLayout authentication><EditPost /></AuthLayout> },
//       { path: '/post/:slug', element: <Post /> },
//       { path: '/admin-dashboard', element: <AdminDashboard /> },

//       // Nest Seller Routes
//       {
//         path: '/seller',
//         element: <SellerLayout />, // contains <Outlet /> for children
//         children: [
//           { path: 'dashboard', element: <SellerDashboard /> },
//           { path: 'listings', element: <Listings /> },
//           { path: 'add-post', element: <AuthLayout authentication><AddPost /></AuthLayout> },
//           { path: 'orders', element: <Orders /> },
//           { path: 'profile', element: <Profile /> },
//           { path: 'messages', element: <Messages /> },
//         ]
//       }
//     ]
//   }
// ])

// ReactDom.createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </StrictMode>
// )
