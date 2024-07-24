import defaultImg from "@/assets/placeholder.jpg"
import { placePhotoUrl } from "@/constans/options";
import { Carousel } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip }) {
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
        <Link to={'/view-trip/' + trip?.id}>
            <div className="">
                <Carousel className='w-full h-80 rounded-xl bg-gray-500' autoplay>
                    {photoUrl.map((photo, index) => (
                        <div key={index}>
                            <img className='w-full h-80 object-fill rounded-xl' src={photo.urls.regular || defaultImg} alt="default img" />
                        </div>
                    ))}
                </Carousel>
                <div>
                    <h2 className="font-bold text-lg">{trip?.userSelection?.location}</h2>
                    <h2 className="text-sm text-gray-500">
                        {trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
                    </h2>
                </div>
            </div>
        </Link>
    )
}

export default UserTripCardItem