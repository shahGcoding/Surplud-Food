import React, {useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function PostForm({post}) {

    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)

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
            ? await appwriteService.updatePost(post.$id, { ...data, featuredImage: fileId, userId: userData?.$id })
            : await appwriteService.createPost({ ...data, featuredImage: fileId, userId: userData?.$id });
    
            if (dbPost) {
                console.log("Post successfully saved:", dbPost);
                navigate(`/post/${dbPost.$id}`);
            }
        } catch (error) {
            console.error("Error adding/updating post:", error.message);
        }
    };
    

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') 
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-")
        
        return ''

    }, [])          

    React.useEffect(() => {

        const subscription = watch((value, {name}) =>{
            if (name === 'title') {
                setValue('slug', slugTransform(value?.title || ""), {shouldValidate: true})
            }
        });

        return () => subscription.unsubscribe();

    },[watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
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
                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                }}
            />
            <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
        </div>
        <div className="w-1/3 px-2">
            <Input
                label="Featured Image :"
                type="file"
                className="mb-4"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
            />
            {post?. featuredImage && (
                <div className="w-full mb-4">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
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
            <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full duration-200 hover:bg-blue-500 transition-transform hover:scale-105">
                {post ? "Update" : "Submit"}
            </Button>
        </div>
    </form>
      )
}

export default PostForm

