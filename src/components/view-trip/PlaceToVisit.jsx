import PlaceCardItem from './PlaceCardItem'

function PlaceToVisit({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>

            <div>
                {trip?.tripData?.itinerary?.map((item, index) => (
                    <div key={index} >
                        <div className='mt-5'>
                            <h2 className='font-medium text-lg'>Day {item.day}</h2>
                            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5">
                                {item.plan.map((place, index) => (
                                    <div className='' key={index}>
                                        <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                                        <PlaceCardItem place={place} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlaceToVisit