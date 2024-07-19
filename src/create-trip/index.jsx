import { Button } from "@/components/ui/button";
import Logo from '../assets/logo.svg'
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
} from "@/components/ui/dialog"
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AutoComplete, Form, TreeSelect } from 'antd';
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

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
    const [selectedLocation, setSelectedLocation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCountriesAndCities();
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

            const allOptions = [...countryOptions, ...cityOptions]
            setOptions(allOptions);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const handleSearch = (text) => {
        setSearchText(text);
        handleInputChange('location', text);
        if (text) {
            const newFilteredOptions = options.filter(option =>
                option.label.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredOptions(newFilteredOptions);
        } else {
            setFilteredOptions(options);
        }
    };

    const handleTreeSelectChange = (value) => {
        setSelectedLocation(value);
        setSearchText(value);
        handleInputChange('location', value);
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
    })

    const onGenerateTrip = async () => {
        const user = localStorage.getItem('user');
        toast.info("Please wait, the trip is being created.")
        if (formData?.noOfDays > 5 && !formData?.location || !formData?.budget || !formData?.traveler) {
            toast.error("Please fill all details.")
            return;
        } else {
            if (!user) {
                setOpenDailog(true);
                return;
            }
            setIsLoading(true);
            const FINAL_PROMPT = AI_PROMPT
                .replace('{location}', formData?.location)
                .replace('{totalDays}', formData?.noOfDays)
                .replace('{traveler}', formData?.traveler)
                .replace('{budget}', formData?.budget)
                .replace('{totalDays}', formData?.noOfDays)

            const result = await chatSession.sendMessage(FINAL_PROMPT)
            setIsLoading(false);
            toast.success("The trip was successfully created.")
            saveAiTrip(result?.response?.text());
        }
    }

    const saveAiTrip = async (TripData) => {
        setIsLoading(true)
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();
        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            userEmail: user?.email,
            id: docId
        });
        setIsLoading(false);
        navigate('/view-trip/' + docId);
    }

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDailog(false);
            onGenerateTrip();
            toast("Preparing Your Travel Plan!")
        })
    }

    return (
        <div className='sm:px-10 md:px-32 lg:px-96 xl:px-96 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
            <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

            <div className="mt-20 flex flex-col gap-10">
                <div>
                    <h2 className='text-xl my-3 font-medium'>What is destination of choice?</h2>
                    <div className="relative h-10 w-full">
                        <Form labelCol={{ span: 12 }} wrapperCol={{ span: 24 }}>
                            <Form.Item>
                                <div style={{ display: 'flex' }}>
                                    <TreeSelect
                                        style={{ width: '30%' }}
                                        treeData={options}
                                        placeholder="Please select"
                                        treeDefaultExpandAll
                                        onChange={handleTreeSelectChange}
                                    />
                                    <AutoComplete
                                        style={{ width: '70%' }}
                                        options={filteredOptions}
                                        value={searchText}
                                        onChange={handleSearch}
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
                            placeholder={"Ex.3"}
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
                            className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${formData?.budget == item.title && 'shadow-lg border-black'}`}
                            key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                        >
                            <h2 className="text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-20">
                <h2 className='font-bold text-3xl'>Who do you plan on traveling with on your next adventure?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    {SelectTravelesList.map((item, index) => (
                        <div
                            className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${formData?.traveler == item.people && 'shadow-lg border-black'}`}
                            key={index}
                            onClick={() => handleInputChange('traveler', item.people)}
                        >
                            <h2 className="text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-14 flex justify-end">
                <Button disable={isLoading} onClick={onGenerateTrip}>
                    {isLoading ?
                        <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
                        :
                        ("Generate Trip")}
                </Button>
            </div>
            <Dialog open={openDailog} onOpenChange={setOpenDailog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><img className='py-2 w-36' src={Logo} alt="Logo" /> </DialogTitle>
                        <DialogDescription>
                            <div>
                                <h2 className="font-bold text-lg mb-3">Sign In With Google</h2>
                                <p className="mb-3">Sign in to the App with Google authentication securely</p>
                            </div>

                            <Button onClick={login} className="w-full gap-2 mt-5 flex items-center">
                                <FcGoogle className="w-7 h-7" />
                                Sign In With Google
                            </Button>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default CreateTrip;
