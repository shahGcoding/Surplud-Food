import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo, Select } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

const login = async (data) => {
  setError("");
  try {
    const session = await authService.login(data);
    if (session) {
      const userData = await authService.getCurrentUser();
      if (userData) {

        dispatch(authLogin(userData)); // Store user in Redux

        localStorage.setItem("userId", userData.$id);   
        localStorage.setItem("role", userData.role);   

        setTimeout(() => {
          if (userData.role === "admin") navigate("/admin/dashboard");
          else if (userData.role === "seller") navigate("/seller/dashboard");
          else navigate("/");
        }, 500);
      }
    }
  } catch (error) {
    setError(error.message);
  }
};

  

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign into your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password:"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: true,
                // validate: {
                //     matchPattern:            optional
                // }
              })}
            />

            <Link>
            <p className="text-blue-400 m-3">forget password?</p>
            </Link>

            <Button type="submit" className="w-full bg-green-700 hover:cursor-pointer hover:bg-green-500 text-white">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
