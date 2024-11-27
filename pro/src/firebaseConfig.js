import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//const firebaseConfig = {
//  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//  appId: process.env.REACT_APP_FIREBASE_APP_ID,
//  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
//};

const firebaseConfig = {
  apiKey: "AIzaSyAAq40rM6nz6AbXW5DifTf8Axm1Ss5xQFw",
  authDomain: "readnext-10c36.firebaseapp.com",
  projectId: "readnext-10c36",
  storageBucket: "readnext-10c36.appspot.com",
  messagingSenderId: "107285687559",
  appId: "1:107285687559:web:0b15b691e101ff081c29a2",
  measurementId: "G-8VBYEWKXQ9"
};

export default firebaseConfig;

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
export const googleProvider = new GoogleAuthProvider();
