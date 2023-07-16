// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQxQwh0r02eWUQXBRjRe_icTwj77NIvIE",
  authDomain: "house-marketting-ed1a5.firebaseapp.com",
  projectId: "house-marketting-ed1a5",
  storageBucket: "house-marketting-ed1a5.appspot.com",
  messagingSenderId: "812134477448",
  appId: "1:812134477448:web:db20b52867976fd384793d",
  measurementId: "G-VNF16SGX6K"
};

// Initialize Firebase
initializeApp(firebaseConfig);
// getAnalytics(app);
export const db = getFirestore();
