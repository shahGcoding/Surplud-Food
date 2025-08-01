import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { Button, Input, Logo, Select } from "./index";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [role, setRole] = useState("buyer");

  const { register, handleSubmit } = useForm();
  


  const create = async (data) => {
    setError("");
    try {
        const userData = await authService.createAccount({ 
            email: data.email, 
            password: data.password, 
            name: data.name, 
            role: data.role, // Ensure role is passed
            businessName: data.businessName || "",
            businessAddress: data.businessAddress || "",
            phone: data.phone || "",
        });

        if (userData) {
            dispatch(login(userData)); 

            setTimeout(() => {
              if (userData.role === "admin") navigate("/admin-dashboard");
              else if (userData.role === "seller") navigate("/seller-dashboard");
              else navigate("/");
            }, 500);
        }
    } catch (error) {
        setError(error.message);
    }
};


  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            {/* Full Name */}
            <Input
              label="Full Name:"
              placeholder="Enter your full name"
              {...register("name", { required: true })}
            />

            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be valid",
                },
              })}
            />

            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />

            {/* Extra Fields for Sellers */}
            {role === "seller" && (
              <>
                <Input
                  label="Business Name:"
                  placeholder="Enter your business name"
                  {...register("businessName", { required: true })}
                />

                <Input
                  label="Business Address:"
                  placeholder="Enter your business address"
                  {...register("businessAddress", {
                    required: true,
                  })}
                />

                <Input
                  label="Contact Number:"
                  placeholder="Enter your contact number"
                  {...register("contactNumber", {
                    required: true,
                  })}
                />
              </>
            )}

            <Select
              options={["buyer", "seller"]}
              label="Role"
              placeholder="Select role"
              className="mb-4"
              {...register("role", { required: true })}
              onChange={(e) => setRole(e.target.value)}
            />

            <Button type="submit" className="w-full bg-green-700 hover:cursor-pointer hover:bg-green-500 text-white">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
