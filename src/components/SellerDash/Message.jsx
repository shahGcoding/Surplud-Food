import React, { useEffect, useState } from 'react';
//import { getMessagesForSeller } from '../../appwrite/service'; // Assuming this method exists in your Appwrite service file
//import { Card } from '@/components/ui/card'; // Assuming shadcn/ui is used
import { Loader2 } from 'lucide-react';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const sellerId = localStorage.getItem("userId"); // Adjust if using different storage or context

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessagesForSeller(sellerId); // Custom Appwrite function
        setMessages(response.documents); // If Appwrite returns documents
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [sellerId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">📬 Buyer Messages</h2>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-green-600" size={40} />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.$id} className="p-4 bg-white shadow rounded-xl border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-green-700">👤 {msg.buyerName}</h4>
                <span className="text-sm text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-800">{msg.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;
