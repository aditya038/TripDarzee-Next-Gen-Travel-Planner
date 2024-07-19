import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbnySdTdt5B5J3qSgdRJqv5Rt7tJ-1vUY",
    authDomain: "fir-app-384cb.firebaseapp.com",
    projectId: "fir-app-384cb",
    storageBucket: "fir-app-384cb.appspot.com",
    messagingSenderId: "123811068084",
    appId: "1:123811068084:web:965d7e34607834215cffe1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);