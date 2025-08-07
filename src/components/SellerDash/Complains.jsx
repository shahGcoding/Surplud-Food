import React, {useState, useEffect} from 'react';
import appwriteService from "../../appwrite/config";
import { useSelector } from 'react-redux';
import {Input, Button} from "../../components";
import { useForm } from 'react-hook-form';

function Complains() {

    const [sellerName, setSellerName] = useState("");
    
    const userData = useSelector((state) => state.auth.userData );
    const sellerId = userData.$id;

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm();

    const onSubmit = async (data) =>{
        const complainData = {
            sellerId: sellerId,
            sellerName: sellerName,
            buyerRole: "buyer",
            sellerRole: "seller",
            buyerId: data.buyerId,
            buyerName: data.buyerName,
            messageBy: "seller",
            message: data.message,
            status: "unread",
            createdAt: new Date().toISOString(),
        }
        try {
            await appwriteService.postComplaint(complainData);
            alert("Complaint post succesfully !")
            reset();
        } catch (error) {
            throw error
        }
        
    }

    useEffect(() =>{
        const fetchSeller = async () =>{
            try {
                const response = await appwriteService.getAllUsers();
                const currentUser = response.documents.find((d) => d.userId === userData?.$id )

                if(currentUser){
                    setSellerName(currentUser.name)
                }

            } catch (error) {
                throw error
            }
        }

        if(userData?.$id){
            fetchSeller();
        }

    }, [])

  return (
    <div className='max-w-xl mx-auto bg-white p-4 rounded shadow'>
        <h1 className='font-bold text-2xl mb-4'>Submit Complaint to Admin</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <Input
            label="Buyer Name/Email : "
            placholder="Enter buyer name...."
            {...register("buyerName", {required: true})}
            />

            {errors.buyerName && (
          <p className="text-red-500">{errors.buyerName.message}</p>
        )}

            <Input
            label="BuyerId : "
            placholder="Enter buyer Id..."
            {...register("buyerId",{required: true})}
            />
            {errors.buyerId && (
          <p className="text-red-500">{errors.buyerId.message}</p>
        )}

            <div>
                <label className='block font-medium mb-1'>Complaint Message </label>
                <textarea
                {...register("message",{required: true})}
                placeholder='Write your complaint here...'
                rows={4}
                className='w-full p-2 rounded border'
                />
                {errors.message && (
          <p className="text-red-500">{errors.message.message}</p>
        )}
            </div>

            <Button
             type='submit'
             className="w-full bg-green-700 hover:bg-green-600 text-white"
             disabled={isSubmitting}   
            >
                {isSubmitting ? "Submiting...." : "Submit Complaint"}
            </Button>

        </form>
    </div>
  )
}

export default Complains