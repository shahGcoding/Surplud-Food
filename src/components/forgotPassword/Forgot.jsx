import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "../index";
import { forgotPassword } from "../../config/config";
import { useNavigate } from "react-router-dom";

function Forgot() {

    const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data); 
        alert("Email sent to your Gmail account !");
        navigate("/");
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Forgot Password
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your email to receive a password reset link
        </p>

        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
          <Input
            type="email"
            label="Email Address"
            placeholder="example@gmail.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}

          <Button
            type="submit"
            className="w-full py-2 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

      </div>
    </div>
  );
}

export default Forgot;
