import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAAq40rM6nz6AbXW5DifTf8Axm1Ss5xQFw",
    authDomain: "readnext-10c36.firebaseapp.com",
    projectId: "readnext-10c36",
    storageBucket: "readnext-10c36.appspot.com",
    messagingSenderId: "107285687559",
    appId: "1:107285687559:web:0b15b691e101ff081c29a2",
    measurementId: "G-8VBYEWKXQ9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
