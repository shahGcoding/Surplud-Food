import React, { useEffect, useState } from 'react';
import { getUserById, getCurrentUser, getMessageForSeller, markMessageAsRead } from '../../config/config';
import { useSelector } from 'react-redux';

const Message = () => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData  = useSelector((state) => state.auth.userData);

  const sellerId = userData?._id 

  const fetchMessages = async () => {

      const session = await getCurrentUser()
      const userDoc = await getUserById(session._id)

       if(userDoc.status === 'inactive'){
       return alert("blocked user can't seen the messages");
    }

      try { 
        if(!sellerId) return;

        const response = await getMessageForSeller(userDoc._id) // Custom Appwrite function
        setMessages(response); // If Appwrite returns documents
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
  
  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId); // Custom Appwrite function
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
            <div key={msg._id} className="bg-white shadow-md p-4 rounded-xl">
              {
                (msg.status === "Unread") && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  NEW
                </span>
              )
              }
              <p className="text-gray-700">{msg.message}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span>From: {msg.buyerId ? msg.buyerId.username : "Unknown Buyer"}</span> <br />
                <span>{new Date(msg.dateSent).toLocaleString()}</span>
              </div>
              {
                (msg.status === "Unread") && (
                  <button onClick={() => handleMarkAsRead(msg._id)} className="mt-2 text-blue-500 hover:underline">
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
