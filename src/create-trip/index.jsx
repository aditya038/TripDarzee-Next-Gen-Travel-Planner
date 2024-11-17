import { Button } from "@/components/ui/button";
import Logo from '../assets/logo.png';
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "@/constans/options";
import { chatSession } from "@/service/AIModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AutoComplete, Form } from 'antd';
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Chatbot from './Chatbot.jsx';
import UserTripCardItem from '@/components/my-trips/UserTripCardItem'; // Import the component for displaying user trips

function CreateTrip() {
    const [openDailog, setOpenDailog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        location: '',
        noOfDays: '',
        budget: '',
        traveler: ''
    });

    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [communityTrips, setCommunityTrips] = useState([]); // State for community trips
    const navigate = useNavigate();

    useEffect(() => {
        fetchCountriesAndCities();
        fetchCommunityTrips(); // Fetch community trips when component mounts
    }, []);

    const fetchCountriesAndCities = async () => {
        try {
            const countriesResponse = await axios.get('https://restcountries.com/v3.1/all');
            const countryOptions = countriesResponse.data.map(country => ({
                value: country.name.common,
                label: country.name.common,
            }));

            const citiesResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities');
            const cityOptions = citiesResponse.data.data.map(city => ({
                value: city.city,
                label: `${city.city}, ${city.country}`,
            }));

            const allOptions = [...countryOptions, ...cityOptions];
            setOptions(allOptions);
            setFilteredOptions(allOptions); // Initialize filtered options
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchCommunityTrips = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'AITrips'));
            const trips = [];
            querySnapshot.forEach((doc) => {
                trips.push({ id: doc.id, ...doc.data() }); // Include document ID
            });
            setCommunityTrips(trips); // Update state with community trips
        } catch (error) {
            console.error("Error fetching community trips:", error);
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        if (text) {
            const newFilteredOptions = options.filter(option =>
                option.label.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredOptions(newFilteredOptions);
        } else {
            setFilteredOptions(options);
        }
    };

    const handleSelect = (value) => {
        setFormData({
            ...formData,
            location: value
        });
        setSearchText(value);
    };

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    });

    const onGenerateTrip = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setOpenDailog(true);
            return;
        } else {
            if (formData?.noOfDays < 5 && formData?.location && formData?.budget && formData?.traveler) {
                toast.info("Please wait, the trip is being created.");
                setIsLoading(true);
                const FINAL_PROMPT = AI_PROMPT
                    .replace('{location}', formData?.location)
                    .replace('{totalDays}', formData?.noOfDays)
                    .replace('{traveler}', formData?.traveler)
                    .replace('{budget}', formData?.budget);

                try {
                    const result = await chatSession.sendMessage(FINAL_PROMPT);
                    setIsLoading(false);
                    const tripDataText = result?.response?.text?.();
                    if (typeof tripDataText === 'string') {
                        toast.success("The trip was successfully created.");
                        saveAiTrip(tripDataText);
                    } else {
                        throw new Error("Invalid trip data format");
                    }
                } catch (error) {
                    setIsLoading(false);
                    toast.error("An error occurred while creating the trip.");
                    console.error("Error generating trip:", error);
                }
            } else {
                toast.error("Please fill all details.");
                return;
            }
        }
    };

    const saveAiTrip = async (TripData) => {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();

        let parsedTripData;

        try {
            // Log the raw AI trip data for debugging
            console.log("Raw Trip Data Text:", TripData);

            // Clean up the AI response to ensure proper JSON formatting
            const cleanedTripData = TripData
                .replace(/,\s*}/g, "}")  // Remove trailing commas before closing braces
                .replace(/,\s*\]/g, "]"); // Remove trailing commas before closing brackets

            // Attempt to parse the cleaned-up JSON
            parsedTripData = JSON.parse(cleanedTripData);

        } catch (error) {
            console.error("Error parsing trip data:", error.message);
            console.log("Original trip data:", TripData); // Log the raw data for debugging
            toast.error("Failed to parse trip data. Please try again later.");
            setIsLoading(false);
            return;
        }

        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: parsedTripData,
            userEmail: user?.email,
            id: docId
        });
        setIsLoading(false);
        navigate('/view-trip/' + docId);
    };

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDailog(false);
            window.location.reload();
            onGenerateTrip();
            toast("Preparing Your Travel Plan!");
        });
    };

    return (
        <div className='sm:px-10 md:px-32 lg:px-96 xl:px-96 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
            <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

            <div className="mt-20 flex flex-col gap-10">
                <div>
                    <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
                    <div className="relative h-10 w-full">
                        <Form labelCol={{ span: 12 }} wrapperCol={{ span: 24 }}>
                            <Form.Item>
                                <div style={{ display: 'flex' }}>
                                    <AutoComplete
                                        style={{ width: '100%' }}
                                        options={filteredOptions}
                                        value={searchText}
                                        onChange={handleSearch}
                                        onSelect={handleSelect}
                                        placeholder="Search for a country or city"
                                    />
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div>
                    <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
                    <div className="relative h-10 w-full">
                        <Input
                            placeholder={"Ex. 3"}
                            type={"number"}
                            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <h2 className='font-bold text-3xl'>What is Your Budget?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    {SelectBudgetOptions.map((item, index) => (
                        <div
                            className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${formData?.budget === item.title ? 'shadow-lg border-black' : ''}`}
                            key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                        >
                            <h2 className="text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-20">
                <h2 className='font-bold text-3xl'>How many people are traveling?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    {SelectTravelesList.map((item, index) => (
                        <div
                            className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${formData?.traveler === item.title ? 'shadow-lg border-black' : ''}`}
                            key={index}
                            onClick={() => handleInputChange('traveler', item.title)}
                        >
                            <h2 className="text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <Button
                    onClick={onGenerateTrip}
                    disabled={isLoading}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Create Trip"}
                </Button>
            </div>

            {/* Add the Chatbot component */}
            <Chatbot />

            {/* Community Trips Section */}
            <div className='mt-20'>
                <h2 className='font-bold text-3xl'>Community Trips</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
                    {communityTrips.length > 0 ? (
                        communityTrips.map((trip, index) => (
                            <UserTripCardItem key={index} trip={trip} />
                        ))
                    ) : (
                        <p className='text-gray-500'>No community trips available yet.</p>
                    )}
                </div>
            </div>

            {/* Google Login Dialog */}
            <Dialog open={openDailog} onOpenChange={setOpenDailog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex justify-center items-center">
                                <img src={Logo} alt="Logo" className="h-10" />
                            </div>
                        </DialogTitle>
                        <DialogDescription className="flex justify-center">
                            <Button onClick={() => login()} className="space-x-5">
                                <FcGoogle className="h-7 w-7" /> <span>Login with Google</span>
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateTrip;
