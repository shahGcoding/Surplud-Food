// import React from 'react'
// import appwriteService from '../appwrite/config'
// import { Link } from 'react-router-dom'

// function PostCard({$id, title, featuredImage}) {

//   console.log('post id : ', $id);
//   console.log("Featured Image ID:", featuredImage);

//   return (
//     <Link to={`/post/${$id}`}>
//         <div className='w-full bg-gray-100, rounded-xl p-4'>
//             <div className='w-full justify-center mb-4'>
//             {console.log("File ID for Preview:", featuredImage)}
//                 <img src={appwriteService.getFilePreview(featuredImage)} alt={title} 
//                 className='rounded-xl'/>
//             </div>
//             <h2
//             className='text-xl font-bold'
//             >{title}</h2>
//         </div>
//     </Link>
//   )
// }

// export default PostCard

import React from 'react';
import appwriteService from '../appwrite/config';
import {Button} from "./index"
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostCard({ $id, title, price, featuredImage }) {
  const imageUrl =
    appwriteService.getFileURL(featuredImage) ||
    "https://via.placeholder.com/300x200.png?text=No+Image";

    console.log("Image URL:", imageUrl);
  
   const userData = useSelector((state) => state.auth.userData);
   const showOnly= true //= userData?.role === 'buyer' ? true : false; 
    

  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full bg-gray-200 rounded-xl p-4'>
        <div className='w-full justify-center mb-4'>
          <img
            src={imageUrl}
            alt={title}
            className='rounded-xl w-full object-cover h-[200px]'
          />
        </div>
        <h2 className='text-xl font-bold'>{title}</h2>
        <h2 className='text-xl font-bold mt-4'>Rs.{price}</h2>
       { showOnly &&  <Button 
        type='submit'
        className='w-full mt-4 bg-green-700 text-white p-2 duration-200 transition-transform hover:cursor-pointer hover:scale-95 hover:bg-green-500  rounded-lg'
        >
          Order Now!
        </Button>}
      </div>

    </Link>
  );
}

export default PostCard;
