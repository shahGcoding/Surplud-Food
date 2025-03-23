import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
    const role = useSelector((state) => state.auth.role);
    console.log("PrivateRoute Role:", role, "Allowed:", allowedRoles); // Debugging

    return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
