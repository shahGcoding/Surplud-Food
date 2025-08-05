import React, {useState, useEffect} from 'react'
import appwriteService from "../../appwrite/config"
import {Button} from '../../components'
import { useSelector } from 'react-redux';

function HandleComplaints() {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = useSelector((state) => state.auth.userData)
  const adminId = userData.$id;

  const fetchComplaints = async () => {
  
    try {
      const response = await appwriteService.getAllComplaints();
      setComplaints(response.documents)
    } catch (error) {
      throw error
    } finally{
      setLoading(false)
    }
  }

  //  if(adminId){
  //   fetchComplaints();
  //     const interval = setInterval(fetchComplaints, 2000);
  //     return () => clearInterval(interval);
  // }

  useEffect(() => {
    fetchComplaints();
  }, [])

  const handleMarkResolved  = async (complaintId) =>{
    
    try {
      await appwriteService.updateComplaintStatus(complaintId, "resolved");
      alert("complaint marked as resolved");
      fetchComplaints(); // for refresh
      
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async (complaintId) => {
    try {
      await appwriteService.deleteComplaint(complaintId);
      alert("complaint deleted");
      fetchComplaints()
    } catch (error) {
      throw error;
    }
  }

  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className=''>
      <h2 className='font-semibold text-3xl mt-0 mb-2 '>Total({complaints.length}) | Resolved({resolved})</h2>
      <h1 className='font-bold text-2xl mb-4'>Manage Complaints</h1>

    {loading ? (
      <p>loading complaints.... </p>
    ) : complaints.length === 0 ? (
      <p>no complaint Available</p>
    ) : (
    <div className='space-y-4'>
      {complaints.map((complaint) => (
        <div
        key={complaint.$id}
        className="p-4 border rounded bg-white shadow"
        >
           <p><strong>Buyer:</strong> {complaint.buyerName} ({complaint.buyerId})</p>
              <p><strong>Seller:</strong> {complaint.sellerName} ({complaint.sellerId})</p>
              <p><strong>Order ID:</strong> {complaint.orderId}</p>
              <p><strong>Message:</strong> {complaint.message}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>Submitted:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>

             <div className="flex gap-4 mt-3">
                {complaint.status !== "resolved" && (
                  <Button
                    onClick={() => handleMarkResolved(complaint.$id)}
                    className="bg-green-600 text-white"
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(complaint.$id)}
                  className="bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>

        </div>

        
      ))}
      </div>
    )

    }

    </div>
  )
}

export default HandleComplaints    