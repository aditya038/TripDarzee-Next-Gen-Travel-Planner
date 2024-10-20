import defaultImg from "@/assets/placeholder.jpg"
import { placePhotoUrl } from "@/constans/options";
import { Carousel } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState([]);
    const [error, setError] = useState(null);

    const getPlacePhoto = async () => {
        try {
            const url = placePhotoUrl.replace('{NAME}', place?.placeName);
            const result = await axios.get(url);
            setPhotoUrl(result.data.results);
        } catch (error) {
            setError(error);
            console.error("Error fetching place photo:", error);
        }
    }
    useEffect(() => {
        place && getPlacePhoto();
    }, [place])
    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName} target="_blank">
            <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
                <Carousel className='min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px] rounded-xl bg-gray-500' autoplay>
                    {error ? (
                        <div>
                            <img className='min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px] object-fill rounded-xl' src={defaultImg} alt="default img" />
                        </div>
                    ) : (
                        photoUrl.map((photo, index) => (
                            <div key={index}>
                                <img className='min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px] object-fill rounded-xl' src={photo.urls.regular || defaultImg} alt="default img" />
                            </div>
                        ))
                    )}
                </Carousel>
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-lg">{place?.placeName}</h2>
                    <p className="text-sm text-gray-500 text-justify">{place?.placeDetails}</p>
                    <h2 className="text-sm font-medium">💰 {place?.ticketPricing}</h2>
                    <h2 className="text-sm font-medium">⭐ {place?.rating} stars</h2>
                </div>
            </div>
        </Link>
    )
}

export default PlaceCardItem