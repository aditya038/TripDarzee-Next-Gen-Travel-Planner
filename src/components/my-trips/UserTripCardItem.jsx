import defaultImg from "@/assets/placeholder.jpg"
import { placePhotoUrl } from "@/constans/options";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip }) {
    const [photoUrl, setPhotoUrl] = useState(null);

    const getPlacePhoto = async () => {
        const url = placePhotoUrl.replace('{NAME}', trip?.userSelection?.location)
        const result = await axios.get(url);
        setPhotoUrl(result.data.results[3].urls.regular)
    }
    useEffect(() => {
        trip && getPlacePhoto();
    }, [trip])
    return (
        <Link to={'/view-trip/' + trip?.id}>
            <div className="hover:scale-105 transition-all">
                <img src={photoUrl ? photoUrl : defaultImg} className='w-full h-80 object-fill rounded-xl' alt="" />
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