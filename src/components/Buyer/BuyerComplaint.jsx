import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Input, Button } from "../index";
import { useSearchParams } from "react-router-dom";

function BuyerComplaint() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const userData = useSelector((state) => state.auth.userData);
  const userRole = useSelector((state) => state.auth.role)
  
  const [searchParams] = useSearchParams();

  const [buyerName, setBuyerName] = useState("");

  useEffect(() => {
    const sellerId = searchParams.get("sellerId");
    const orderId = searchParams.get("orderId");
    const sellerName = searchParams.get("sellerName");

    if (sellerName) setValue("sellerName", sellerName);
    if (sellerId) setValue("sellerId", sellerId);
    if (orderId) setValue("orderId", orderId);
  }, [searchParams, setValue]);

  // Fetch buyerName based on buyerId
  useEffect(() => {
    const fetchBuyerDetails = async () => {
      try {
        const response = await appwriteService.getAllUsers();
        const currentUser = response.documents.find(
          (user) => user.userId === userData?.$id
        );
        if (currentUser) {
          setBuyerName(currentUser.name);
        }
      } catch (error) {
        console.error("Error fetching buyer name", error);
      }
    };

    if (userData?.$id) {
      fetchBuyerDetails();
    }
  }, [userData]);

  const onSubmit = async (data) => {

    const complainData = {
      buyerId: userData.$id,
      role: userRole,
      buyerRole: "buyer",
      sellerRole: "seller",
      messageBy: "buyer",
      buyerName: buyerName,
      sellerId: data.sellerId,
      sellerName: data.sellerName,
      orderId: data.orderId,
      message: data.message,
      status: "unread",
      createdAt: new Date().toISOString(),
    };

    console.log("Complain data", complainData);

    try {
      await appwriteService.postComplaint(complainData);
      alert("Complaint submit Successfully !");
      reset();
    } catch (error) {
      throw error
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Submit Complaint to Admin</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Seller ID"
          placeholder="Enter seller ID"
          type="password"
          {...register("sellerId", { required: "Seller ID is required" })}
        />
        {errors.sellerId && (
          <p className="text-red-500">{errors.sellerId.message}</p>
        )}

        <Input
          label="Seller Name"
          placeholder="Enter seller name"
          {...register("sellerName", { required: "Seller name is required" })}
        />
        {errors.sellerName && (
          <p className="text-red-500">{errors.sellerName.message}</p>
        )}

        <Input
          label="Order ID"
          placeholder="Enter order ID"
          type="password"
          {...register("orderId")}
        />

        <div>
          <label className="block font-medium mb-1">Complaint Message</label>
          <textarea
            {...register("message", { required: "Message is required" })}
            placeholder="Write your complaint here..."
            rows={4}
            className="w-full border p-2 rounded"
          />
          {errors.message && (
            <p className="text-red-500">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>
    </div>
  );
}

export default BuyerComplaint;
