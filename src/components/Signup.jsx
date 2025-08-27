import React, { useState } from "react";
import { registerUser } from "../config/config.js";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo, Select } from "./index";
import { login } from "../store/authSlice.js";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [role, setRole] = useState("buyer");

  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const userData = await registerUser({
            email: data.email,
            password: data.password,
            username: data.name,
            role: data.role,
            businessName: data.businessName || "",
            businessAddress: data.businessAddress || "",
            phone: data.phone || "",
            latitude: lat,
            longitude: lng,
          });

          if (userData) {

            if (!userData.isverified) {
              navigate("/verify-email");
            } else {
              navigate("/login"); 
            }
          }

        } catch (error) {
          setError(error.response?.data?.message || error.message);
        }
      },
      (error) => {
        console.error("Error getting location", error);
        setError("Location access is required for signup.");
      }
    );
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
                  {...register("businessAddress", { required: true })}
                />

                <Input
                  label="Contact Number:"
                  placeholder="Enter your contact number"
                  {...register("phone", { required: true })}
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

            <Button
              type="submit"
              className="w-full bg-green-700 hover:cursor-pointer hover:bg-green-500 text-white"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
