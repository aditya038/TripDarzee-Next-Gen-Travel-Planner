import defaultImg from "@/assets/placeholder.jpg"
import { Button } from "../ui/button"
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import { useEffect, useState } from "react";
import { placePhotoUrl } from "@/constans/options";
import { Carousel } from 'antd';

function InfoSection({ trip }) {
    const [photoUrl, setPhotoUrl] = useState([]);

    const getPlacePhoto = async () => {
        const url = placePhotoUrl.replace('{NAME}', trip?.userSelection?.location)
        const result = await axios.get(url);
        setPhotoUrl(result.data.results)
    }
    useEffect(() => {
        trip && getPlacePhoto();
    }, [trip])
    return (
        <div>
            <Carousel className='w-full h-[550px] object-cover rounded-xl bg-gray-500' autoplay>
                {photoUrl.map((photo, index) => (
                    <div key={index}>
                        <img className='w-full h-[550px] object-cover rounded-xl' src={photo.urls.regular || defaultImg} alt="default img" />
                    </div>
                ))}
            </Carousel>
            <div className="flex justify-between items-center">
                <div className="my-5 flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">{trip?.userSelection?.location}</h2>
                    <div className="flex gap-3">
                        <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm">
                            📅 {Number(trip?.userSelection?.noOfDays)} Day
                        </h2>
                        <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm">
                            💰 {trip?.userSelection?.budget} Budget
                        </h2>
                        <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-sm">
                            🥂 No. Of Traveler: {trip?.userSelection?.traveler}
                        </h2>
                    </div>
                </div>
                <Button><IoIosSend /></Button>
            </div>
        </div>
    )
}

export default InfoSection