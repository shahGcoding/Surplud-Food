// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import appwriteService from "../appwrite/config";
// import { Button, Container } from "../components";
// import parse from "html-react-parser";
// import { useSelector } from "react-redux";

// export default function Post() {
//     const [post, setPost] = useState(null);
//     const { slug } = useParams();
//     const navigate = useNavigate();

//     const userData = useSelector((state) => state.auth.userData);

//     const isAuthor = post && userData ? post.userId === userData.$id : false;

//     useEffect(() => {

//         console.log("User Data from Redux:", userData);

//         if (slug) {
//             appwriteService.getPost(slug).then((post) => {
//                 if (post) setPost(post);
//                 else navigate("/");
//             });
//         } else navigate("/");
//     }, [slug, navigate, userData]);

//     const deletePost = () => {
//         appwriteService.deletePost(post.$id).then((status) => {
//             if (status) {
//                 appwriteService.deleteFile(post.featuredImage);
//                 navigate("/");
//             }
//         });
//     };

//     return post ? (
//         <div className="py-8">
//             <Container>
//                 <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
//                     <img
//                         src={appwriteService.getFilePreview(post.featuredImage)}
//                         alt={post.title}
//                         className="rounded-xl"
//                     />

//                     {isAuthor && (
//                         <div className="absolute right-6 top-6">
//                             <Link to={`/edit-post/${post.$id}`}>
//                                 <Button bgColor="bg-green-500" className="mr-3">
//                                     Edit
//                                 </Button>
//                             </Link>
//                             <Button bgColor="bg-red-500" onClick={deletePost}>
//                                 Delete
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//                 <div className="w-full mb-6">
//                     <h1 className="text-2xl font-bold">{post.title}</h1>
//                 </div>
//                 <div className="browser-css">
//                     {parse(post.content)}
//                     </div>
//             </Container>
//         </div>
//     ) : null;
// }


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import appwriteService from "../appwrite/config";
// import { Button, Container } from "../components";
// import parse from "html-react-parser";
// import { useSelector } from "react-redux";

// export default function Post() {
//     const [post, setPost] = useState(null);
//     const { slug } = useParams();
//     const navigate = useNavigate();
//     const userData = useSelector((state) => state.auth.userData);

//     // Determine if the user is the post author or an admin
//     const canModify = post && userData 
//         ? (post.userId === userData.userId || userData.role === "seller") 
//         : false;

//     useEffect(() => {
//         if (slug) {
//             appwriteService.getPost(slug).then((post) => {
//                 if (post) setPost(post);
//                 else navigate("/");
//             });
//         } else navigate("/");
//     }, [slug, navigate]);

//     const deletePost = () => {
//         appwriteService.deletePost(post.$id).then((status) => {
//             if (status) {
//                 appwriteService.deleteFile(post.featuredImage);
//                 navigate("/");
//             }
//         });
//     };

//     return post ? (
//         <div className="py-8">
//             <Container>
//                 <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
//                     <img
//                         src={appwriteService.getFileURL(post.featuredImage)}
//                         alt={post.title}
//                         className="rounded-xl"
//                     />

//                     {canModify && (
//                         <div className="absolute right-6 top-6">
//                             <Link to={`/edit-post/${post.$id}`}>
//                                 <Button bgColor="bg-green-500" className="mr-3">
//                                     Edit
//                                 </Button>
//                             </Link>
//                             <Button bgColor="bg-red-500" onClick={deletePost}>
//                                 Delete
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//                 <div className="w-full mb-6">
//                     <h1 className="text-2xl font-bold">{post.title}</h1>
//                 </div>  
//                 <div className="browser-css mb-4">
//                     {parse(post.content)}
//                 </div>
//                 <div className="w-full mb-6">
//                     <h1 className="text-2xl font-bold">Rs.{post.price}</h1>
//                 </div>
//                 <div className="w-full mb-6">
//                     <h1 className="text-2xl font-bold">{post.quantity}</h1>
//                 </div>
//             </Container>
//         </div>
//     ) : null;
// }


import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [seller, setSeller] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
     const [placingOrder, setPlacingOrder] = useState(false);

    const canModify = post && userData
        ? (post.userId === userData.userId || userData.role === "seller")
        : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post){
                     setPost(post);
                     appwriteService.getUserById(post.userId).then((user) => setSeller(user));
                }
                else navigate("/");
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };


    const handlePlaceOrder = async () => {
        if (!userData || userData.role !== "buyer") {
            alert("Only buyers can place orders.");
            return;
        }

        setPlacingOrder(true);

        try {
            const orderData = {
                foodTitle: post.title,
                quantity: post.quantity,
                totalPrice: post.price,
                buyerName: userData.name || userData.email || "Unknown Buyer",
                orderDate: new Date().toISOString(),
                sellerId: post.userId,
                status: "Pending",
            };

            const response = await appwriteService.postOrder(orderData);
            if (response) {
                alert("Order placed successfully!");
                navigate("/buyer/orders");
            }
        } catch (error) {
            console.error("Order placing error:", error);
            alert("Something went wrong while placing the order.");
        } finally {
            setPlacingOrder(false);
        }
    };




return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={appwriteService.getFileURL(post.featuredImage)}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {canModify && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">Edit</Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={() => {
                                appwriteService.deletePost(post.$id).then(() => {
                                    appwriteService.deleteFile(post.featuredImage);
                                    navigate("/");
                                });
                            }}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-3xl font-bold">{post.title}</h1>
                    <p className="mt-2 text-gray-600">{parse(post.content)}</p>
                    <p className="text-lg font-semibold mt-4">Price: Rs. {post.price}</p>
                    <p className="text-lg">Quantity: {post.quantity}</p>
                </div>

                {/* Seller Info */}
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <p className="text-sm font-semibold">Seller Info:</p>
                    <p className="text-sm text-gray-700">Name: {post.sellerName || "N/A"}</p>
                    <p className="text-sm text-gray-700">Address: {post.businessAddress || "N/A"}</p>
                </div>

                {/* Place Order */}
                {userData?.role === "buyer" && (
                    <Button
                        onClick={handlePlaceOrder}
                        bgColor="bg-blue-600"
                        className="w-full hover:bg-blue-700 transition"
                        disabled={placingOrder}
                    >
                        {placingOrder ? "Placing Order..." : "Place Order"}
                    </Button>
                )}
            </Container>
        </div>
    ) : null;
}