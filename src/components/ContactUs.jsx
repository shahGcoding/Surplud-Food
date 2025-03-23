import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input, Logo, Button } from "./index";

function ContactUs() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (e) => {
    alert("Your message has been sent!");
    reset();
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <Input
              label="Name: "
              placeholder="Enter your name"
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                {...register("message", { required: "Message is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Write your message..."
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full duration-300 transition-transform hover:cursor-pointer "
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
