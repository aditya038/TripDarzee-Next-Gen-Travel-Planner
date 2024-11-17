import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Load environment variables from .env file
load_dotenv()

# Set API Keys
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("API key is not set. Please set the GEMINI_API_KEY environment variable.")
mapquest_api_key = os.getenv("MAPS_API_KEY")  # Replace with your MapQuest API Key
weather_api_key = os.getenv("WEATHER_API_KEY")  # Replace with your OpenWeather API Key

# Configure Gemini API
genai.configure(api_key=api_key)

# Create the Gemini model
generation_config = {
    "temperature": 0.8,
    "top_p": 0.95,
    "top_k": 50,
    "max_output_tokens": 512,
    "response_mime_type": "text/plain",
}

# Flask app initialization
app = Flask(__name__)
CORS(app)  # Allow all domains (you can restrict this in production)

# Chatbot initialization
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction=(  # System instruction for model behavior
        "You are a chatbot for a travel planner website named TripDarzee, and your name is 'TravelMitra.' "
        "Your primary role is to assist users in planning their trips by gathering their preferences, such as "
        "destination, travel dates, and budget. You will generate personalized itineraries based on user inputs and "
        "provide recommendations for accommodations, transportation, and local attractions. You should also offer "
        "real-time updates on weather, local events, and travel advisories. Ensure that your responses are helpful, "
        "accurate, and tailored to individual user needs, and be ready to handle modifications to trip plans as "
        "requested by the users. You strictly assist users in planning their trips and will only respond to travel-related "
        "questions such as accommodations, transportation, itineraries, weather updates, local events, and travel advisories. "
        "You will refuse to answer any unrelated topics and politely ask the user to stay on travel-related questions."
    ),
)

history = []  # Conversation history
itinerary = []  # User itinerary

# Initial welcome message
welcome_message = (
    "Hello there! 👋 Welcome to TripDarzee! I'm TravelMitra, your personal travel assistant. "
    "What kind of trip are you dreaming of? Tell me all about it, and I'll help you weave a perfect travel tapestry! 🧵✨"
)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Helper functions
def is_travel_related(user_input):
    travel_keywords = [
        "trip", "hotel", "flights", "destination", "itinerary", "transport", 
        "restaurant", "book", "continue", "yes", "ok", "confirm", "cancel", 
        "change", "next", "plan", "schedule", "tourism", "accommodation", 
        "travel", "weather", "route", "flight", "place", "sightseeing"
    ]
    return any(keyword in user_input.lower() for keyword in travel_keywords)

def geocode_location(location):
    url = "http://www.mapquestapi.com/geocoding/v1/address"
    params = {
        "key": mapquest_api_key,
        "location": location
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()
        if response.status_code == 200 and data.get('info', {}).get('statuscode') == 0:
            loc = data['results'][0]['locations'][0]['latLng']
            return loc['lat'], loc['lng']
        else:
            logging.error(f"Geocoding error: {data.get('info', {}).get('messages', ['Unknown error'])[0]}")
            return None, None
    except Exception as e:
        logging.error(f"Error geocoding location: {e}")
        return None, None

def find_nearby_places(lat, lng, place_type='hotel', radius=2000):
    url = "http://www.mapquestapi.com/search/v4/place"
    params = {
        "key": mapquest_api_key,
        "location": f"{lat},{lng}",
        "sort": "distance",
        "feedback": False,
        "q": place_type,
        "circle": f"{lng},{lat},{radius}"
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()
        if response.status_code == 200 and "results" in data:
            places = [result["name"] for result in data["results"]]
            return f"Here are some {place_type}s nearby: " + ", ".join(places) if places else f"Sorry, no {place_type}s found nearby."
        else:
            logging.error(f"Error finding places: {data}")
            return f"Sorry, I couldn't find any {place_type}s near the given location."
    except Exception as e:
        logging.error(f"Error retrieving nearby places: {e}")
        return "Error retrieving nearby places."

def get_weather(location):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={weather_api_key}&units=metric"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            weather_data = response.json()
            return (f"The current temperature in {location} is {weather_data['main']['temp']}°C "
                    f"with {weather_data['weather'][0]['description']}.")
        else:
            logging.error(f"Weather API error: {response.json()}")
            return f"Sorry, I couldn't fetch the weather data for {location}."
    except Exception as e:
        logging.error(f"Error retrieving weather data: {e}")
        return "Error retrieving weather data."

def modify_itinerary(modification_type, place):
    global itinerary
    if modification_type == 'remove':
        itinerary = [dest for dest in itinerary if dest != place]
        return f"Got it! I removed {place} from your itinerary."
    elif modification_type == 'add':
        itinerary.append(place)
        return f"{place} has been added to your itinerary!"
    return "Invalid modification type."

def summarize_history(limit=1000):
    global history
    total_length = sum(len(entry["parts"][0]) for entry in history)
    if total_length > limit:
        history = history[-5:]  # Keep the last 5 interactions for context

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "").strip()
    logging.debug(f"User Input: {user_input}")

    if not user_input:
        logging.warning("Received empty user input.")
        return jsonify({"response": "Please provide a message."}), 400

    # Enforce travel-related topics
    if not is_travel_related(user_input):
        logging.warning(f"Non-travel-related query: {user_input}")
        return jsonify({"response": "I can only help with travel-related queries! 😊 Please ask about your trip, itinerary, hotels, etc."}), 400

    # Process user input
    response = "I'm not sure how to assist with that."
    
    # Check for nearby places
    if "find" in user_input.lower() and "near" in user_input.lower():
        words = user_input.split()
        if len(words) >= 4:  # Ensure there are enough words
            place_type = words[1]  # Assuming format: "find <type> near <location>"
            location = ' '.join(words[3:])  # Join the remaining words as the location
            lat, lng = geocode_location(location)
            if lat is not None and lng is not None:
                response = find_nearby_places(lat, lng, place_type=place_type)
            else:
                response = f"Sorry, I couldn't find the location: {location}."
    elif "weather" in user_input.lower():
        location = user_input.split()[-1]  # Assume the last word is the location
        response = get_weather(location)
    elif "add" in user_input.lower():
        place = user_input.split()[-1]  # Assume the last word is the place to add
        response = modify_itinerary('add', place)
    elif "remove" in user_input.lower():
        place = user_input.split()[-1]  # Assume the last word is the place to remove
        response = modify_itinerary('remove', place)
    else:
        # Use the generative model for other queries
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(user_input).text

    # Update conversation history
    history.append({"role": "user", "parts": [user_input]})
    history.append({"role": "model", "parts": [response]})
    summarize_history()

    return jsonify({"response": response})

@app.route("/")
def index():
    return welcome_message

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
