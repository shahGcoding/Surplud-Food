import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import "./App.css";
import { getCurrentUser, getUserRole } from "./config/config";
import { Header, Footer } from "./components";
import { login, logout } from "./store/authSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAndStoreUser = async () => {
      try {
        if (userData) {
          setLoading(false);
          return;
        }

        const userRes = await getCurrentUser();
       // const userDataRes = userRes?.data;
        if (userRes) {
          const roleRes = await getUserRole(userRes._id);

          const updatedUser = {...userRes, role: roleRes?.role || "buyer",};

          dispatch(login(updatedUser));

          // redirect based on role
          if (updatedUser.role === "admin") navigate("/admin-dashboard");
          else if (updatedUser.role === "seller") navigate("/seller-dashboard");
          else navigate("/");
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchAndStoreUser();
  }, [navigate, dispatch]);

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-100">
      <div className="w-full block">
        <Header />
        <main className="bg-gray-100">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;
