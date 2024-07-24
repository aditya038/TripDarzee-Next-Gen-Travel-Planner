# PlanMyTrip

PlanMyTrip is an AI-powered travel planning application designed to help users plan their vacations effortlessly. By leveraging Gemini AI, the application creates customized vacation plans based on user inputs, including location, number of people, number of vacation days, and budget type. The generated plans include hotel accommodations and a detailed day-by-day itinerary of places to visit.

## Features

- **AI-Powered Trip Planning:** Utilizes Gemini AI to generate personalized vacation plans.
- **Custom Itineraries:** Provides day-by-day itineraries, including places to visit and activity suggestions.
- **Hotel Recommendations:** Recommends hotels based on user preferences and budget.
- **User Authentication:** Secure login with Google OAuth via `react-oauth/google`.
- **Real-time Data Storage:** Uses Firebase for efficient data management and user authentication.

## Technologies

- **Frontend:** React
- **Backend:** Gemini AI
- **Authentication:** Google OAuth (`react-oauth/google`)
- **Database:** Firebase

## Getting Started

To get a local copy of the project up and running, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/nuricanbrdmr/PlanMyTrip-AI-Travel-Planner-Website.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd PlanMyTrip-AI-Travel-Planner-Website
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env.local` File:** 

   Create a `.env.local` file in the root directory and add your Firebase configuration and Gemini API key:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_GOOGLE_AUTH_CLIENT_ID=your_google_auth_client_id
   ```

5. **Start the Development Server:**

   ```bash
   npm run dev
   ```

6. **Visit the Application:**

   Open your browser and go to `http://localhost:3000` to view the application.

## Usage

- **Login:** Use Google OAuth to authenticate and access the application.
- **Plan a Trip:** Enter your location, number of people, number of vacation days, and budget type to generate a travel plan.
- **View Itinerary:** Explore the detailed day-by-day itinerary and hotel recommendations.
- **View Created Plans**: Access and manage all your created travel plans.

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Create new albums and songs on the Spotify Admin page.
3. Browse albums and songs, create playlists, and enjoy music.

## Demo Video Link

[PlanMyTrip Demo Video](https://www.youtube.com/watch?v=B_3PNPe022M)

## Screenshot

### Home Page
![Screenshot_1](https://github.com/user-attachments/assets/ad11c768-646c-4b72-baf9-950a2a3a8e53)

### Generate Trip Page
![Screenshot_2](https://github.com/user-attachments/assets/1ce88fa2-db9f-4f39-8676-5efb6d9fbc3a)

### Created Trip Page
![Screenshot_4](https://github.com/user-attachments/assets/74c607ce-17d0-4ce7-be45-dc74ca7fd740)

![Screenshot_5](https://github.com/user-attachments/assets/e430b411-81d5-4e70-b1e3-8ec716689efa)

### My Tip Page
![Screenshot_3](https://github.com/user-attachments/assets/8537f3fa-b898-42ec-a623-902551f7ae8d)

## References

I used [TubeGuruji YouTube channel](https://www.youtube.com/@tubeguruji) to develop this project. Thank you for the useful content.
