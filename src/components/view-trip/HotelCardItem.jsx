import defaultImg from "@/assets/placeholder.jpg"
import { placePhotoUrl } from "@/constans/options";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
function HotelCardItem({ item }) {
    const [photoUrl, setPhotoUrl] = useState(null);

    const getPlacePhoto = async () => {
        const url = placePhotoUrl.replace('{NAME}', item?.hotelName)
        const result = await axios.get(url);
        setPhotoUrl(result.data.results[0].urls.regular)
    }
    useEffect(() => {
        item && getPlacePhoto();
    }, [item])
    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + item?.hotelName + "," + item?.hotelAddress} target="_blank">
            <div className="hover:scale-105 transition-all cursor-pointer" >
                <img className="w-full h-56 object-fill rounded-xl" src={photoUrl ? photoUrl : defaultImg} alt="hotel img" />
                <div className="my-2 flex flex-col gap-2">
                    <h2 className="font-medium">{item?.hotelName}</h2>
                    <h2 className="text-sm text-gray-500">📍 {item?.hotelAddress}</h2>
                    <h2 className="text-sm font-medium">💰 {item?.price}</h2>
                    <h2 className="text-sm font-medium">⭐ {item?.rating} stars</h2>
                </div>
            </div>
        </Link>
    )
}

export default HotelCardItem