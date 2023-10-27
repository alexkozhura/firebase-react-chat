// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9ovTEU9JymCOyn6upc3gCyDqBYpFydEM",
  authDomain: "react-firebase-chat-a6f36.firebaseapp.com",
  projectId: "react-firebase-chat-a6f36",
  storageBucket: "react-firebase-chat-a6f36.appspot.com",
  messagingSenderId: "748483723515",
  appId: "1:748483723515:web:6ed42ebf221861791af05e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
// Create a database to store users and messages
export const db = getFirestore(app);