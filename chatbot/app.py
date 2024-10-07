from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
from dotenv import load_dotenv
import requests
import google.generativeai as genai

load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # Apply CORS globally to the app

# Set API Keys
api_key = os.getenv("GEMINI_API_KEY")
mapquest_api_key = os.getenv("MAPS_API_KEY")

# Raise an error if API keys are not found
if not api_key:
    raise ValueError("API key is not set. Please set the GEMINI_API_KEY environment variable.")
if not mapquest_api_key:
    raise ValueError("MapQuest API key is not set. Please set the MAPS_API_KEY environment variable.")

# Configure the Gemini API
genai.configure(api_key=api_key)

# Create the Gemini model
generation_config = {
    "temperature": 2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction=(
        "You are a chatbot for a travel planner website named TripDarzee, and your name is 'TravelMitra.' "
        "Your primary role is to assist users in planning their trips by gathering their preferences, such as "
        "destination, travel dates, and budget. You will generate personalized itineraries based on user inputs and "
        "provide recommendations for accommodations, transportation, and local attractions."
    ),
)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    history = data.get('history', [])

    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(user_input)

    model_response = response.text
    history.append({"role": "user", "parts": [user_input]})
    history.append({"role": "model", "parts": [model_response]})

    return jsonify({
        "response": model_response,
        "history": history
    })

# Add other routes like geocode if needed

if __name__ == '__main__':
    app.run(debug=True)
