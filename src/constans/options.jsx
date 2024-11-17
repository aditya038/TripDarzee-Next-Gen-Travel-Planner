export const SelectTravelesList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A sole traveler in exploration',
        icon: '✈️',
        people: '1'
    },
    {
        id: 2,
        title: "A Couple",
        desc: "Two travelers in tandem",
        icon: "🥂",
        people: "2 People"
    },
    {
        id: 3,
        title: "Family",
        desc: "A group of fun-loving adventurers",
        icon: "🏡",
        people: "3 to 5 People"
    },
    {
        id: 4,
        title: "Friends",
        desc: "A bunch of thrill-seekers",
        icon: "⛵",
        people: "5 to 10 People"
    }
];

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
        desc: "Don't worry about cost",
        icon: "💸",
    },
];

export const AI_PROMPT = 'Generate a travel plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. Provide a list of hotel options including HotelName, Hotel Address, Price, Verified Hotel Image URL (ensure the image corresponds exactly to the specified hotel), Geo Coordinates, Rating, and Descriptions. Suggest an itinerary with six tourist spots for each day instead of lunch and dinner, including PlaceName, Place Details, Verified Place Image URL (ensure the image corresponds exactly to the specified place), Geo Coordinates, Ticket Pricing, Rating, and Time Travel for each location. The daily plan for {totalDays} days should include the best time to visit, formatted in JSON. Please ensure that the suggested images correspond exactly to the places mentioned.';

export const placePhotoUrl = "https://api.unsplash.com/search/photos?query={NAME}&client_id=QCT-_83Y6-zlAZ64rTNvGvE1eLL_2yYQOFSi4uD0xxc";
