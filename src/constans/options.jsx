export const SelectTravelesList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A sole traveles in exploration',
        icon: '✈️',
        people: '1'
    },
    {
        id: 2,
        title: "A Couple",
        desc: "Two traveles in tandem",
        icon: "🥂",
        people: "2 People"
    },
    {
        id: 3,
        title: "Family",
        desc: "A group of fun loving adv",
        icon: "🏡",
        people: "3 to 5 People"
    },
    {
        id: 4,
        title: "Friends",
        desc: "A bunch of thrill-seekes",
        icon: "⛵",
        people: "5 to 10 People"
    }
]

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵',
    },
    {
        id: 2,
        title: "Moderate",
        desc: "Keep cost on the average side",
        icon: "💰",
    },
    {
        id: 3,
        title: "Luxury",
        desc: "Dont worry about cost",
        icon: "💸",
    },
]

export const AI_PROMPT = 'Generate a travel plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. Give me a Hotels options list with HotelName, Hotel Address, Price, Hotel Image URL, Geo Coordinates, Rating,  Descriptions and suggest itinerary with PlaceName, Place Details, Place Image URL, Geo Coordinates, Ticket Pricing, Rating, Time Travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.'
export const placePhotoUrl = "https://api.unsplash.com/search/photos?query={NAME}&client_id=QCT-_83Y6-zlAZ64rTNvGvE1eLL_2yYQOFSi4uD0xxc"