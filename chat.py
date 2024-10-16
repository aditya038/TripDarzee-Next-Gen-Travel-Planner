import os
import requests
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

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
    "temperature": 2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

def is_travel_related(user_input):
    travel_keywords = ["trip", "hotel", "flights", "destination", "itinerary", "transport", "restaurant", "book", "continue", "yes", "ok", "confirm", "cancel", "change", "next", "plan", "schedule", 
                       "tourism", "accommodation", "travel", "weather", "route", "flight", "place", "sightseeing"]
    return any(keyword in user_input.lower() for keyword in travel_keywords)

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction=(
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

history = []

# Initial unprompted welcome message
welcome_message = ("Hello there! 👋 Welcome to TripDarzee! I'm TravelMitra, your personal travel assistant. "
                   "What kind of trip are you dreaming of? Tell me all about it, and I'll help you weave a perfect travel tapestry! 🧵✨")
print(f"Bot: {welcome_message}")
history.append({"role": "model", "parts": [welcome_message]})

# Basic AI chat interaction and error handling for APIs
def geocode_location(location):
    url = "http://www.mapquestapi.com/geocoding/v1/address"
    params = {
        "key": mapquest_api_key,
        "location": location
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()
        if response.status_code == 200 and data['info']['statuscode'] == 0:
            location = data['results'][0]['locations'][0]['latLng']
            return location['lat'], location['lng']
        else:
            return None, None
    except Exception as e:
        print(f"Bot: Error retrieving location data: {e}")
        return None, None

# Nearby places functionality (e.g., hotels, attractions)
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
            return f"Here are some {place_type}s nearby: " + ", ".join(places)
        else:
            return f"Sorry, I couldn't find any {place_type}s near the given location."
    except Exception as e:
        return f"Bot: Error retrieving nearby places: {e}"

# Weather updates using OpenWeather API
def get_weather(location):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={weather_api_key}&units=metric"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            weather_data = response.json()
            return (f"The current temperature in {location} is {weather_data['main']['temp']}°C "
                    f"with {weather_data['weather'][0]['description']}.")
        else:
            return f"Sorry, I couldn't fetch the weather data for {location}."
    except Exception as e:
        return f"Bot: Error retrieving weather data: {e}"

# Dynamic trip modification (e.g., add/remove destinations)
def modify_itinerary(itinerary, modification_type, place):
    if modification_type == 'remove':
        itinerary = [dest for dest in itinerary if dest != place]
        return f"Got it! I removed {place} from your itinerary.", itinerary
    elif modification_type == 'add':
        itinerary.append(place)
        return f"{place} has been added to your itinerary!", itinerary
    return itinerary

# Improved contextual awareness (optional history summarizing function)
def summarize_history(history, limit=1000):
    total_length = sum(len(entry["parts"][0]) for entry in history)
    if total_length > limit:
        history = history[-5:]  # Keep the last 5 interactions for context
    return history

# Error feedback for insufficient user input
def handle_error_feedback(user_input):
    if user_input.strip() == "":
        return "It seems like you haven't provided enough information. Can you clarify your request?"
    elif len(user_input.split()) < 2:
        return "I need a bit more detail to assist you. Please provide more information."
    return None

itinerary = []  # List to store user destinations

while True:
    user_input = input("You: ")

    # Check if the user wants to exit the chatbot
    if user_input.lower() in ["exit", "quit", "bye"]:
        print("Bot: Thanks for using TripDarzee! Safe travels! ✈️👋")
        break

    # Provide feedback for insufficient user input
    feedback = handle_error_feedback(user_input)
    if feedback:
        print(f"Bot: {feedback}")
        continue

    # Enforce travel-related topics
    if not is_travel_related(user_input):
        print("Bot: I can only help with travel-related queries! 😊 Please ask about your trip, itinerary, hotels, etc.")
        continue
    if "find" in user_input.lower() and "near" in user_input.lower():
        words = user_input.split()
        place_type = words[1]  # Expecting input like "find hotels near..."
        location = ' '.join(words[3:])
        
        lat, lng = geocode_location(location)
        if lat and lng:
            places_response = find_nearby_places(lat, lng, place_type=place_type)
            print(f"Bot: {places_response}")
        else:
            print(f"Bot: Sorry, I couldn't find the location: {location}.")
    
    elif "weather" in user_input.lower():
        location = user_input.split()[-1]  # Expecting input like "What's the weather in Paris?"
        weather_response = get_weather(location)
        print(f"Bot: {weather_response}")
    
    elif "add" in user_input.lower():
        place = user_input.split()[-1]  # Expecting input like "Add Paris to my itinerary."
        add_response, itinerary = modify_itinerary(itinerary, 'add', place)
        print(f"Bot: {add_response}")
    
    elif "remove" in user_input.lower():
        place = user_input.split()[-1]  # Expecting input like "Remove Paris from my itinerary."
        remove_response, itinerary = modify_itinerary(itinerary, 'remove', place)
        print(f"Bot: {remove_response}")
    
    else:
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(user_input)
        
        model_response = response.text
        print(f"Bot: {model_response}")
        
        history.append({"role": "user", "parts": [user_input]})
        history.append({"role": "model", "parts": [model_response]})
        history = summarize_history(history)
def handle_error_feedback(user_input):
    if user_input.strip() == "":
        return "It seems like you haven't provided enough information. Can you clarify your request?"
    elif len(user_input.split()) < 2:
        return "I need a bit more detail to assist you. Please provide more information."
    return None