import React, { useEffect, useState } from 'react';
import appwriteService from '../../appwrite/config';
import { useSelector } from 'react-redux';
import authService from '../../appwrite/auth';

const Message = () => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData  = useSelector((state) => state.auth.userData);

  const sellerId = userData?.$id 

  const fetchMessages = async () => {

      const session = await authService.getCurrentUser()
      const userDoc = await appwriteService.getUserById(session.$id)

       if(userDoc.status !== 'active'){
      alert("blocked user can't seen the messages")
      return;
    }

      try { 
        if(!sellerId) return;

        const response = await appwriteService.messageFromBuyer(sellerId) // Custom Appwrite function
        setMessages(response.documents); // If Appwrite returns documents
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
  
  const handleMarkAsRead = async (messageId) => {
    try {
      await appwriteService.markMessageAsRead(messageId); // Custom Appwrite function
      fetchMessages(); // Refresh messages after marking as read
    } catch (error) {
      console.error("Error marking message as read:", error);
      alert("Failed to mark message as read. Please try again.");
    }
  }  

  useEffect(() => {


     if (sellerId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [sellerId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">📬 Buyer Messages</h2>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.$id} className="bg-white shadow-md p-4 rounded-xl">
              {
                (msg.status === "Unread") && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  NEW
                </span>
              )
              }
              <p className="text-gray-700">{msg.message}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span>From: {msg.buyerName}</span> <br />
                <span>{new Date(msg.dateSent).toLocaleString()}</span>
              </div>
              {
                (msg.status === "Unread") && (
                  <button onClick={() => handleMarkAsRead(msg.$id)} className="mt-2 text-blue-500 hover:underline">
                    Mark as Read
                  </button>
                )
              }
              {
                (msg.status === "Read")  && (
                  <span className="text-green-500 text-sm">✔ Message Read</span>
                )
              }
            </div>
          ))

          }
         </div>
      )}

    </div>
  );
};

export default Message;
