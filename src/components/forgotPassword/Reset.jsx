import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../config/config";
import {Button, Input} from "../index";

function Reset() {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const submit = async (data) => {
    try {
      await resetPassword(token, data);
      alert("Password reset Successfully. Now login to your account !");
      navigate("/login");
    } catch (error) {
      console.log("Something went wrong while reseting password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Reset Password
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter new password to login into the website
        </p>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">

            <Input
            type="password"
            lable="New password :"
            placeholder="********"
            {...register("password", {required: true,
                minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            />
            {errors.password && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}

            <Button
            type="submit"
            disabled={isSubmitting}    
            >
             {isSubmitting ? "Setting..." : "set password"}
            </Button>

        </form>

      </div>
    </div>
  );
}

export default Reset;
