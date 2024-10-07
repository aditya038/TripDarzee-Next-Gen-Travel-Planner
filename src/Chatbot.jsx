// src/components/Chatbot.jsx

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaRobot, FaTimes } from "react-icons/fa";

function Chatbot({ tripId }) {
    const [message, setMessage] = useState(""); // User input for chatbot
    const [history, setHistory] = useState([]); // Chat history
    const [loading, setLoading] = useState(false); // Loading state for chatbot response
    const [chatVisible, setChatVisible] = useState(false); // State to toggle chat visibility
    const chatHistoryRef = useRef(null); // Reference to chat history for scrolling

    // Scroll to the bottom of the chat history
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [history]);

    // Handle chatbot message
    const handleChat = async () => {
        if (!message) {
            toast.error("Please enter a message!");
            return;
        }

        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post("http://localhost:5000/chat", {
                message: message,
                history: history
            });
            setHistory((prevHistory) => [
                ...prevHistory,
                { role: "user", parts: [message] },
                { role: "model", parts: [response.data.response] }
            ]);
            setMessage(""); // Clear input field after sending
        } catch (error) {
            console.error("Error interacting with the chatbot:", error.response || error.message);
            toast.error("Error interacting with the chatbot");
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    return (
        <>
            {/* Chatbot Icon */}
            <div 
                className="fixed bottom-4 right-4 cursor-pointer bg-blue-500 text-white rounded-full p-3 shadow-lg" 
                onClick={() => setChatVisible(!chatVisible)} // Toggle chat visibility
            >
                <FaRobot className="w-8 h-8" />
            </div>

            {/* Chatbot Section */}
            {chatVisible && (
                <div className="chatbot bg-white shadow-lg rounded-lg p-4 mt-10 max-w-lg mx-auto fixed bottom-16 right-4">
                    <div className="chat-header flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">TravelMitra</h2>
                        {/* Close Button/Icon */}
                        <button onClick={() => setChatVisible(false)} className="text-gray-500 hover:text-gray-700">
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                    <div 
                        className="chat-history max-h-64 overflow-y-scroll p-4"
                        ref={chatHistoryRef}
                    >
                        {history.map((item, index) => (
                            <div key={index} className={`chat-message mb-2 ${item.role === "model" ? "text-left" : "text-right"}`}>
                                <div className={`inline-block p-2 rounded-lg ${item.role === "model" ? "bg-blue-100" : "bg-gray-300"}`}>
                                    <strong>{item.role === "model" ? "TravelMitra" : "You"}: </strong>{item.parts[0]}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-blue-100 text-left p-2 rounded-lg mb-2">
                                <strong>TravelMitra:</strong> <span className="text-gray-500">...typing</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="chat-input flex mt-4">
                        <input 
                            type="text" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            placeholder="Type your message here..." 
                            className="flex-grow border rounded-l-lg p-2"
                        />
                        <button 
                            onClick={handleChat} 
                            className="bg-blue-500 text-white rounded-r-lg px-4"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;
