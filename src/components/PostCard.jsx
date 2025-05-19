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
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredImage }) {
  const imageUrl =
    appwriteService.getFileURL(featuredImage) ||
    "https://via.placeholder.com/300x200.png?text=No+Image";

    console.log("Image URL:", imageUrl);
    

  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full bg-gray-100 rounded-xl p-4'>
        <div className='w-full justify-center mb-4'>
          <img
            src={imageUrl}
            alt={title}
            className='rounded-xl w-full object-cover h-[200px]'
          />
        </div>
        <h2 className='text-xl font-bold'>{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
