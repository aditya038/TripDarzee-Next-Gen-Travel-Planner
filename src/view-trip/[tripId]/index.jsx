import Footer from "@/components/view-trip/Footer";
import Hotels from "@/components/view-trip/Hotels";
import InfoSection from "@/components/view-trip/InfoSection";
import PlaceToVisit from "@/components/view-trip/PlaceToVisit";
import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { FaRobot, FaTimes } from 'react-icons/fa'; // Import chatbot and close icons
import './Chatbot.css'; // Import the CSS file

function ViewTrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState({}); // Trip data
    const [message, setMessage] = useState(""); // User input for chatbot
    const [history, setHistory] = useState([]); // Chat history
    const [loading, setLoading] = useState(false); // Loading state for chatbot response
    const [chatVisible, setChatVisible] = useState(false); // State to toggle chat visibility
    const chatHistoryRef = useRef(null); // Reference to chat history for scrolling

    // Fetch Trip Information from Firebase
    const getTripData = async () => {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setTrip(docSnap.data());
        } else {
            toast.error('No Trip Found!');
        }
    };

    useEffect(() => {
        tripId && getTripData(); // Fetch trip data when tripId changes
    }, [tripId]);

    // Scroll to the bottom of the chat history
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [history]);

    // Effect to display the welcome message when chat opens
    useEffect(() => {
        if (chatVisible) {
            const welcomeMessage = {
                role: "model",
                parts: [
                    "Hello there! 👋 Welcome to TripDarzee! I'm TravelMitra, your personal travel assistant. " +
                    "What kind of trip are you dreaming of? Tell me all about it, and I'll help you weave a perfect travel tapestry! 🧵✨"
                ]
            };
            setHistory([welcomeMessage]); // Set the initial history with the welcome message
        } else {
            setHistory([]); // Clear chat history when chat is closed
        }
    }, [chatVisible]);

    // Handle chatbot message
    const handleChat = async () => {
        if (!message.trim()) {
            toast.error("Please enter a message!"); // Show error if message is empty
            return;
        }

        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post('http://localhost:5000/chat', {
                message: message
            });

            // Update chat history with user message and response
            setHistory(prevHistory => [
                ...prevHistory,
                { role: "user", parts: [message] },
                { role: "model", parts: [response.data.response] }
            ]);
            setMessage(""); // Clear input field after sending
        } catch (error) {
            console.error("Error interacting with the chatbot:", error.response || error.message);
            toast.error("Error interacting with the chatbot. Please try again later.");
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    return (
        <div className="p-10 md:px-20 lg:px-44 xl:px-56">
            {/* Information Section */}
            <InfoSection trip={trip} />

            {/* Recommended Hotels */}
            <Hotels trip={trip} />

            {/* Daily Plan */}
            <PlaceToVisit trip={trip} />

            {/* Chatbot Icon */}
            <div 
                className="fixed bottom-4 right-4 cursor-pointer bg-blue-500 text-white rounded-full p-3 shadow-lg" 
                onClick={() => setChatVisible(!chatVisible)} // Toggle chat visibility
            >
                <FaRobot className="w-8 h-8" />
            </div>

            {/* Chatbot Section */}
            {chatVisible && (
                <div className="chatbot bg-white shadow-lg rounded-lg p-4 mt-10 max-w-lg mx-auto fixed bottom-16 right-4 z-50">
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

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default ViewTrip;
