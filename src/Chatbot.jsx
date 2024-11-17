import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaRobot, FaTimes } from "react-icons/fa";
import "./Chatbot.css"; // Import CSS file for chatbot styles

function Chatbot({ tripId }) {
    const [message, setMessage] = useState(""); // User's input message
    const [history, setHistory] = useState([]); // Chat history array
    const [loading, setLoading] = useState(false); // Loading state for AI response
    const [chatVisible, setChatVisible] = useState(false); // Toggle for chatbot visibility
    const chatHistoryRef = useRef(null); // Reference to chat history container for auto-scrolling

    // Scroll to the bottom of chat history whenever it updates
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [history]);

    // Initialize welcome message when chat is opened
    useEffect(() => {
        if (chatVisible && history.length === 0) {
            const welcomeMessage = {
                role: "model",
                parts: [
                    "Hello there! 👋 Welcome to TripDarzee! I'm TravelMitra, your personal travel assistant. " +
                    "What kind of trip are you dreaming of? Tell me all about it, and I'll help you weave a perfect travel tapestry! 🧵✨"
                ],
                timestamp: new Date().toLocaleTimeString()
            };
            setHistory([welcomeMessage]);
        } else if (!chatVisible) {
            setHistory([]); // Clear history when the chat is closed
        }
    }, [chatVisible]);

    // Handle message sending to the backend
    const handleChat = async () => {
        if (!message.trim()) {
            toast.error("Please enter a message!");
            return;
        }

        const userMessage = {
            role: "user",
            parts: [message],
            timestamp: new Date().toLocaleTimeString()
        };

        setHistory((prevHistory) => [...prevHistory, userMessage]);
        setMessage(""); // Clear input field after sending
        setLoading(true); // Show loading state while fetching AI response

        try {
            // Ensure the payload structure matches your backend expectations
            const response = await axios.post("http://localhost:5000/chat", {
                message: userMessage.parts[0], // Send only the text message
            });

            // Update chat history with TravelMitra's response
            const botResponse = {
                role: "model",
                parts: [response.data.response],
                timestamp: new Date().toLocaleTimeString()
            };

            setHistory((prevHistory) => [...prevHistory, botResponse]);
        } catch (error) {
            console.error("Error interacting with the chatbot:", error.response ? error.response.data : error);
            const errorMessage = error.response?.data?.message || "Failed to communicate with the chatbot. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    // Prevent form submission's default behavior
    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleChat();
    };

    return (
        <>
            {/* Chatbot Icon for Opening/Closing */}
            <div 
                className={`chatbot-icon fixed bottom-4 right-4 cursor-pointer bg-blue-500 text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform ${chatVisible ? "rotate-180" : ""}`}
                onClick={() => setChatVisible(!chatVisible)}
            >
                <FaRobot className="w-8 h-8" />
            </div>

            {/* Chatbot Interface */}
            {chatVisible && (
                <div className="chatbot-container bg-white shadow-lg rounded-lg p-4 max-w-lg fixed bottom-16 right-4 z-50 animate-slide-up">
                    <div className="chat-header flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">TravelMitra</h2>
                        <button onClick={() => setChatVisible(false)} className="text-gray-500 hover:text-gray-700">
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="chat-history max-h-64 overflow-y-auto p-4" ref={chatHistoryRef}>
                        {history.map((item, index) => (
                            <div key={index} className={`chat-message mb-2 ${item.role === "model" ? "text-left" : "text-right"}`}>
                                <div className={`message-bubble inline-block p-2 rounded-lg ${item.role === "model" ? "bg-blue-100" : "bg-gray-300"} shadow-sm`}>
                                    <strong>{item.role === "model" ? "TravelMitra" : "You"}:</strong> {item.parts[0]}
                                    <div className="text-xs text-gray-500 mt-1">{item.timestamp}</div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-blue-100 text-left p-2 rounded-lg mb-2">
                                <strong>TravelMitra:</strong> <span className="text-gray-500">...typing</span>
                            </div>
                        )}
                    </div>

                    <form className="chat-input-container flex mt-4 border-t pt-2" onSubmit={handleFormSubmit}>
                        <input 
                            type="text" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            placeholder="Type your message here..." 
                            className="flex-grow border rounded-l-lg p-2 focus:outline-none"
                        />
                        <button 
                            type="submit"
                            className="bg-blue-500 text-white rounded-r-lg px-4"
                            disabled={loading}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default Chatbot;
