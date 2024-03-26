// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr0jvOMCIiPJU1JUhFzs_nwY7GAxVnhVE",
  authDomain: "diary-trail.firebaseapp.com",
  projectId: "diary-trail",
  storageBucket: "diary-trail.appspot.com",
  messagingSenderId: "569468395493",
  appId: "1:569468395493:web:e1a58b70c4474e1533190c",
  measurementId: "G-D177W1FTGS",
};
// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const AnalyticsFirebaseApp = getAnalytics(FirebaseApp);
