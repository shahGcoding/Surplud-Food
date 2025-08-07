import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import authService from "../../appwrite/auth";

function PostForm({ post }) {
  const [userDoc, setUserDoc] = useState(null);

  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
        price: post?.price || "",
        quantity: post?.quantity || "",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const fetchUserStatus = async () => {
    try {
      const session = await authService.getCurrentUser();

      if (!session) {
        console.warn("No session found. User may be logged out.");
        return;
      }

      const doc = await appwriteService.getUserById(session.$id);
      setUserDoc(doc);
    } catch (error) {
      console.error("Error fetching userDoc:", error);
    }
  };

  const submit = async (data) => {
    try {
      console.log("User Data from Redux:", userData); // Debugging

      let fileId = post?.featuredImage; // Keep old image if no new image

      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);

        if (file && file.$id) {
          fileId = file.$id;

          if (post?.featuredImage) {
            await appwriteService.deleteFile(post.featuredImage);
          }
        } else {
          alert("Image upload failed. Please try again.");
          return;
        }
      }

      console.log("Final Data Before Sending to Appwrite:", {
        ...data,
        featuredImage: fileId,
        userId: userData.$id, // Ensure this is included
      });

      const dbPost = post
        ? await appwriteService.updatePost(post.$id, {
            ...data,
            featuredImage: fileId,
            userId: userData?.$id,
          })
        : await appwriteService.createPost({
            ...data,
            featuredImage: fileId,
            userId: userData?.$id,
          });

      if (dbPost) {
        console.log("Post successfully saved:", dbPost);
        navigate(`/post/${dbPost.$id}`);
      }
    } catch (error) {
      console.error("Error adding/updating post:", error.message);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    if (!userDoc || !userData) return;

    if (userData.role === "seller" && userDoc.status !== "active") {
      alert("You are blocked from posting new listings.");
      navigate("/seller/dashboard");
    }
  }, [userDoc, userData, navigate]);

  // for blocked or unblock user
  useEffect(() => {
    fetchUserStatus();

    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value?.title || ""), {
          shouldValidate: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <div>
      <h1 className="font-bold text-3xl mb-8">Add Food Listing</h1>
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap border-2 border-gray-200">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <Input
          label="Price :"
          placeholder="Price in PKR"
          type="number"
          className="mb-4"
          {...register("price", { required: true, min: 1 })}
        />
        <Input
          label="Quantity :"
          placeholder="Quantity Available"
          type="number"
          className="mb-4"
          {...register("quantity", { required: true, min: 1 })}
        />
        <RTE
          label="Description / Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post?.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFileURL(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full duration-200 bg-green-700 hover:cursor-pointer hover:bg-green-500 transition-transform hover:scale-105"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
    </div>
  );
}

export default PostForm;
