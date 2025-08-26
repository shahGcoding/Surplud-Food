import React, {useState, useEffect} from 'react';
import { postComplaint } from '../../config/config';
import { useSelector } from 'react-redux';
import {Input, Button} from "../../components";
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

function Complains() {

   // const [sellerName, setSellerName] = useState("");
    
    const userData = useSelector((state) => state.auth.userData );
    const sellerId = userData?._id;
    const [searchParams] = useSearchParams();

    const {register, handleSubmit, setValue, reset, formState: {errors, isSubmitting}} = useForm();

    useEffect(() => {

        const buyerId = searchParams.get("buyerId");
        if(buyerId) setValue("buyerId", buyerId);

    }, [searchParams, setValue])

    const onSubmit = async (data) =>{
        const complainData = {
            buyerId: data.buyerId,
            sellerId: sellerId,
            messageBy: userData.role,
            message: data.message,

        }
        try {
            await postComplaint(complainData);
            alert("Complaint post succesfully !")
            reset();
        } catch (error) {
            throw error
        }
        
    }


  return (
    <div className='max-w-xl mx-auto bg-white p-4 rounded shadow'>
        <h1 className='font-bold text-2xl mb-4'>Submit Complaint to Admin</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* <Input
            label="Buyer Email : "
            placholder="Enter buyer name...."
            {...register("buyerEmail", {required: true})}
            />

            {errors.buyerName && (
          <p className="text-red-500">{errors.buyerName.message}</p>
        )} */}

             <Input
            label="Buyer Id : "
            type="password"
            {...register("buyerId", {required: true})}
            />

            {errors.buyerId && (
          <p className="text-red-500">{errors.buyerId.message}</p>
        )}

            <div>
                <label className='block font-medium mb-1'>Complaint Message </label>
                <textarea
                {...register("message",{required: true})}
                placeholder='Write your complaint here...'
                rows={10}
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