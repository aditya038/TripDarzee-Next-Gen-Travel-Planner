import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: "Generate a travel plan for Location: Mumbai, for 3 Days for Couple with a Cheap budget. Give me a Hotels options list with HotelName, Hotel Address, Price, Hotel Image URL, Geo Coordinates, Rating, Descriptions and suggest itinerary with at least 6 places to visit each day with suitable time frames for visiting in JSON format. Include PlaceName, Place Details, Place Image URL, Geo Coordinates, Ticket Pricing, Rating, Time Travel each of the location for 3 days with each day plan with best time to visit."
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: "```json\n{\n  \"hotelOptions\": [\n    {\n      \"hotelName\": \"Hotel Godwin\",\n      \"hotelAddress\": \"Near Chhatrapati Shivaji Terminus, Mumbai, Maharashtra 400001\",\n      \"price\": \"$40-$80 per night\",\n      \"hotelImageURL\": \"https://example.com/hotel-godwin.jpg\",\n      \"geoCoordinates\": \"18.9402° N, 72.8350° E\",\n      \"rating\": 4.0,\n      \"description\": \"A budget hotel located near the railway station with clean rooms and basic amenities.\"\n    },\n    {\n      \"hotelName\": \"Residency Hotel\",\n      \"hotelAddress\": \"7, M. M. Malviya Road, Near CST, Mumbai, Maharashtra 400001\",\n      \"price\": \"$50-$90 per night\",\n      \"hotelImageURL\": \"https://example.com/residency-hotel.jpg\",\n      \"geoCoordinates\": \"18.9372° N, 72.8359° E\",\n      \"rating\": 4.5,\n      \"description\": \"A well-rated hotel with modern amenities located in the heart of Mumbai.\"\n    },\n    {\n      \"hotelName\": \"The Flora Hotel\",\n      \"hotelAddress\": \"K. Dubhash Marg, Near Grant Road Station, Mumbai, Maharashtra 400007\",\n      \"price\": \"$30-$70 per night\",\n      \"hotelImageURL\": \"https://example.com/flora-hotel.jpg\",\n      \"geoCoordinates\": \"18.9667° N, 72.8322° E\",\n      \"rating\": 3.5,\n      \"description\": \"A cozy budget hotel offering basic facilities close to popular attractions.\"\n    }\n  ],\n  \"itinerary\": [\n    {\n      \"day\": 1,\n      \"plan\": [\n        {\n          \"time\": \"Morning (8:00 AM - 10:00 AM)\",\n          \"placeName\": \"Gateway of India\",\n          \"placeDetails\": \"Iconic arch monument and a great place to start your Mumbai adventure.\",\n          \"placeImageURL\": \"https://example.com/gateway-of-india.jpg\",\n          \"geoCoordinates\": \"18.9218° N, 72.8347° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Mid-Morning (10:30 AM - 12:00 PM)\",\n          \"placeName\": \"Elephanta Caves\",\n          \"placeDetails\": \"Explore ancient rock-cut caves and sculptures, accessible by ferry.\",\n          \"placeImageURL\": \"https://example.com/elephanta-caves.jpg\",\n          \"geoCoordinates\": \"18.9864° N, 72.9302° E\",\n          \"ticketPricing\": \"$10-$15 (ferry included)\",\n          \"rating\": 4.0\n        },\n        {\n          \"time\": \"Afternoon (12:30 PM - 2:00 PM)\",\n          \"placeName\": \"Lunch at Leopold Cafe\",\n          \"placeDetails\": \"Enjoy a meal at this iconic Mumbai cafe, known for its vibrant atmosphere.\",\n          \"placeImageURL\": \"https://example.com/leopold-cafe.jpg\",\n          \"geoCoordinates\": \"18.9243° N, 72.8359° E\",\n          \"ticketPricing\": \"Varies\",\n          \"rating\": 4.0\n        },\n        {\n          \"time\": \"Afternoon (2:30 PM - 4:00 PM)\",\n          \"placeName\": \"Chhatrapati Shivaji Maharaj Terminus\",\n          \"placeDetails\": \"A UNESCO World Heritage Site, famous for its Victorian Gothic architecture.\",\n          \"placeImageURL\": \"https://example.com/cst.jpg\",\n          \"geoCoordinates\": \"18.9402° N, 72.8350° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Late Afternoon (4:30 PM - 6:00 PM)\",\n          \"placeName\": \"Marine Drive\",\n          \"placeDetails\": \"Enjoy a stroll along this picturesque seaside promenade.\",\n          \"placeImageURL\": \"https://example.com/marine-drive.jpg\",\n          \"geoCoordinates\": \"18.9456° N, 72.8265° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Evening (6:30 PM - 8:00 PM)\",\n          \"placeName\": \"Dinner at Bademiya\",\n          \"placeDetails\": \"Famous for its kebabs and street food, located near Colaba.\",\n          \"placeImageURL\": \"https://example.com/bademiya.jpg\",\n          \"geoCoordinates\": \"18.9575° N, 72.8265° E\",\n          \"ticketPricing\": \"Varies\",\n          \"rating\": 4.5\n        }\n      ]\n    },\n    {\n      \"day\": 2,\n      \"plan\": [\n        {\n          \"time\": \"Morning (8:00 AM - 10:00 AM)\",\n          \"placeName\": \"Sanjay Gandhi National Park\",\n          \"placeDetails\": \"Visit this lush green park and enjoy a morning walk or a bike ride.\",\n          \"placeImageURL\": \"https://example.com/sgnp.jpg\",\n          \"geoCoordinates\": \"19.1846° N, 72.8856° E\",\n          \"ticketPricing\": \"$5-$10\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Mid-Morning (10:30 AM - 12:00 PM)\",\n          \"placeName\": \"Kanheri Caves\",\n          \"placeDetails\": \"Explore ancient Buddhist rock-cut caves located within the park.\",\n          \"placeImageURL\": \"https://example.com/kanheri-caves.jpg\",\n          \"geoCoordinates\": \"19.1857° N, 72.8931° E\",\n          \"ticketPricing\": \"$5\",\n          \"rating\": 4.0\n        },\n        {\n          \"time\": \"Afternoon (12:30 PM - 2:00 PM)\",\n          \"placeName\": \"Lunch at a local eatery in Borivali\",\n          \"placeDetails\": \"Savor authentic Mumbai cuisine at a popular local restaurant.\",\n          \"placeImageURL\": \"https://example.com/borivali-lunch.jpg\",\n          \"geoCoordinates\": \"19.2029° N, 72.8564° E\",\n          \"ticketPricing\": \"Varies\",\n          \"rating\": 4.0\n        },\n        {\n          \"time\": \"Afternoon (2:30 PM - 4:00 PM)\",\n          \"placeName\": \"Haji Ali Dargah\",\n          \"placeDetails\": \"Visit this beautiful mosque located on an islet in the Arabian Sea.\",\n          \"placeImageURL\": \"https://example.com/haji-ali.jpg\",\n          \"geoCoordinates\": \"18.9663° N, 72.8268° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Late Afternoon (4:30 PM - 6:00 PM)\",\n          \"placeName\": \"Worli Seaface\",\n          \"placeDetails\": \"Enjoy stunning views of the sea and the Bandra-Worli Sea Link.\",\n          \"placeImageURL\": \"https://example.com/worli-seaface.jpg\",\n          \"geoCoordinates\": \"18.9956° N, 72.8233° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Evening (6:30 PM - 8:00 PM)\",\n          \"placeName\": \"Dinner at Mahesh Lunch Home\",\n          \"placeDetails\": \"Relish seafood delicacies at this renowned restaurant.\",\n          \"placeImageURL\": \"https://example.com/mahesh-lunch-home.jpg\",\n          \"geoCoordinates\": \"19.0469° N, 72.8244° E\",\n          \"ticketPricing\": \"Varies\",\n          \"rating\": 4.5\n        }\n      ]\n    },\n    {\n      \"day\": 3,\n      \"plan\": [\n        {\n          \"time\": \"Morning (8:00 AM - 10:00 AM)\",\n          \"placeName\": \"Chowpatty Beach\",\n          \"placeDetails\": \"Relax at this famous beach and enjoy some local snacks.\",\n          \"placeImageURL\": \"https://example.com/chowpatty.jpg\",\n          \"geoCoordinates\": \"18.9653° N, 72.8155° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.0\n        },\n        {\n          \"time\": \"Mid-Morning (10:30 AM - 12:00 PM)\",\n          \"placeName\": \"Knesset Eliyahoo Synagogue\",\n          \"placeDetails\": \"Visit this historic synagogue known for its stunning architecture.\",\n          \"placeImageURL\": \"https://example.com/knesset-eliyahoo.jpg\",\n          \"geoCoordinates\": \"18.9383° N, 72.8289° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Afternoon (12:30 PM - 2:00 PM)\",\n          \"placeName\": \"Lunch at a local restaurant in Juhu\",\n          \"placeDetails\": \"Enjoy lunch with a view of the beach at one of Juhu's many eateries.\",\n          \"placeImageURL\": \"https://example.com/juhu-lunch.jpg\",\n          \"geoCoordinates\": \"19.0978° N, 72.8268° E\",\n          \"ticketPricing\": \"Varies\",\n          \"rating\": 4.0\n        },\n        {\n          \"time\": \"Afternoon (2:30 PM - 4:00 PM)\",\n          \"placeName\": \"ISKCON Temple\",\n          \"placeDetails\": \"Experience the spiritual atmosphere at this beautiful temple.\",\n          \"placeImageURL\": \"https://example.com/iskcon-temple.jpg\",\n          \"geoCoordinates\": \"19.1003° N, 72.8260° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5\n        },\n        {\n          \"time\": \"Late Afternoon (4:30 PM - 6:00 PM)\",\n          \"placeName\": \"Banganga Tank\",\n          \"placeDetails\": \"Visit this historic water tank surrounded by temples and local history.\",\n          \"placeImageURL\": \"https://example.com/banganga-tank.jpg\",\n          \"geoCoordinates\": \"18.9750° N, 72.8347° E\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.0\n        },\n        {\n          \"time\": \"Evening (6:30 PM - 8:00 PM)\",\n          \"placeName\": \"Dinner at Prakash Upahaar Kendra\",\n          \"placeDetails\": \"Savor authentic Maharashtrian cuisine at this local favorite.\",\n          \"placeImageURL\": \"https://example.com/prakash.jpg\",\n          \"geoCoordinates\": \"19.0367° N, 72.8482° E\",\n          \"ticketPricing\": \"Varies\",\n          \"rating\": 4.5\n        }\n      ]\n    }\n  ]\n}\n```\n\n**Please note:**\n* Prices are approximate and can vary depending on the time of year and availability.\n* This itinerary is just a suggestion and can be customized to your interests and preferences.\n* Consider checking the websites of the hotels and attractions for the most up-to-date information and pricing.\n* Remember to factor in transportation costs and parking fees.\n* Always plan ahead and make reservations for popular attractions and restaurants, especially during peak season.\n\n**Enjoy your trip to Mumbai!**"
                },
            ],
        },
    ],
});
