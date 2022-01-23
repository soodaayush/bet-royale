// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSBng_909StyCICGds5pqXHUK-zD0Milw",
  authDomain: "bet-royale-bd57d.firebaseapp.com",
  databaseURL: "https://bet-royale-bd57d-default-rtdb.firebaseio.com",
  projectId: "bet-royale-bd57d",
  storageBucket: "bet-royale-bd57d.appspot.com",
  messagingSenderId: "737205187371",
  appId: "1:737205187371:web:a044ea21e6321a55c28b6e",
  measurementId: "G-XQBXKTS58H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
