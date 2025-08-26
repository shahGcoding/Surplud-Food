import React, { useState, useEffect } from "react";
import { getAllComplaints, updateComplaintStatus, deleteComplaint } from "../../config/config";
import { Button } from "../../components";

function HandleComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const response = await getAllComplaints();
      console.log("response", response);
      setComplaints(response || []);
    } catch (error) {
      console.log("Error fetching complaints", error);
      
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleMarkResolved = async (complaintId) => {
    try {
      await updateComplaintStatus(complaintId, "Resolved");
      alert("complaint marked as resolved");
      fetchComplaints(); // for refresh
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (complaintId) => {
    if(window.confirm("Are sure to delete ?")){
    try {
      await deleteComplaint(complaintId);
      alert("complaint deleted");
      fetchComplaints();
    } catch (error) {
      throw error;
    }
  }
  };

  //for status color changings
  const statusColor = (status) => {
    switch(status){
      case "Resolved":
        return "text-green-500";
      default: 
        return "text-yellow-500";   
    }
  }


  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="">
      <h2 className="font-semibold text-3xl mt-0 mb-2 ">
        Total({complaints.length}) | Resolved({resolved})
      </h2>
      <h1 className="font-bold text-2xl mb-4">Manage Complaints</h1>

      {loading ? (
        <p>loading complaints.... </p>
      ) : complaints.length === 0 ? (
        <p>no complaint Available</p>
      ) : (
        <div className="space-y-4">
          {complaints.slice().reverse().map((complaint) => (
            <div
              key={complaint._id}
              className="p-4 border rounded bg-white shadow"
            >
              <p>
                <strong>
                  From ({complaint.messageBy === "seller" ? "seller" : "buyer"})
                  :
                </strong>{" "}
                {""}
                {complaint.messageBy === "seller"
                  ? `${complaint.sellerId?.username} (${complaint.sellerId?._id})`
                  : `${complaint.buyerId?.username} (${complaint.buyerId?._id})`}
              </p>
              <p>
                <strong>
                  To ({complaint.messageBy === "seller" ? "Buyer" : "Seller"}):
                </strong>{" "}
                {complaint.messageBy === "seller"
                  ? `${complaint.buyerId?.username} (${complaint.buyerId?._id})`
                  : `${complaint.sellerId?.username} (${complaint.sellerId?._id})`}
              </p>

              {complaint.messageBy !== "seller" && (
                <p>
                  <strong>Order ID:</strong> {complaint.orderId._id}
                </p>
              )}
              <p>
                <strong>Complaint:</strong> {complaint.message}
              </p>
              <p>
                status:{' '}
                <span className={`font-bold ${statusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(complaint.createdAt).toLocaleString()}
              </p>

              <div className="flex gap-4 mt-3">
                {complaint.status !== "Resolved" && (
                  <Button
                    onClick={() => handleMarkResolved(complaint._id)}
                    className="bg-green-600 text-white"
                  >
                    Mark Resolved
                  </Button>
                )}
                { complaint.status === "Resolved" &&
                <Button
                  onClick={() => handleDelete(complaint._id)}
                  className="bg-red-500 hover:cursor-pointer hover:scale-110 hover:bg-red-700 text-white "
                >
                  Delete
                </Button>
}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HandleComplaints;
