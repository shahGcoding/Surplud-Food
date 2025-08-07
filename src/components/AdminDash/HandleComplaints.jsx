import React, { useState, useEffect } from "react";
import appwriteService from "../../appwrite/config";
import { Button } from "../../components";
import { useSelector } from "react-redux";

function HandleComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const response = await appwriteService.getAllComplaints();
      setComplaints(response.documents);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleMarkResolved = async (complaintId) => {
    try {
      await appwriteService.updateComplaintStatus(complaintId, "resolved");
      alert("complaint marked as resolved");
      fetchComplaints(); // for refresh
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (complaintId) => {
    if(window.confirm("Are sure to delete ?")){
    try {
      await appwriteService.deleteComplaint(complaintId);
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
      case "resolved":
        return "text-green-500";
      default: 
        return "text-yellow-500";   
    }
  }


  const resolved = complaints.filter((c) => c.status === "resolved").length;

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
          {complaints.map((complaint) => (
            <div
              key={complaint.$id}
              className="p-4 border rounded bg-white shadow"
            >
              <p>
                <strong>
                  From ({complaint.messageBy === "seller" ? "seller" : "buyer"})
                  :
                </strong>{" "}
                {""}
                {complaint.messageBy === "seller"
                  ? `${complaint.sellerName} (${complaint.sellerId})`
                  : `${complaint.buyerName} (${complaint.buyerId})`}
              </p>
              <p>
                <strong>
                  To ({complaint.messageBy === "seller" ? "Buyer" : "Seller"}):
                </strong>{" "}
                {complaint.messageBy === "seller"
                  ? `${complaint.buyerName} (${complaint.buyerId})`
                  : `${complaint.sellerName} (${complaint.sellerId})`}
              </p>

              {complaint.messageBy !== "seller" && (
                <p>
                  <strong>Order ID:</strong> {complaint.orderId}
                </p>
              )}
              <p>
                <strong>Message:</strong> {complaint.message}
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
                {complaint.status !== "resolved" && (
                  <Button
                    onClick={() => handleMarkResolved(complaint.$id)}
                    className="bg-green-600 text-white"
                  >
                    Mark Resolved
                  </Button>
                )}
                { complaint.status === "resolved" &&
                <Button
                  onClick={() => handleDelete(complaint.$id)}
                  className="bg-red-600 text-white"
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
