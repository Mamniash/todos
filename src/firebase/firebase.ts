// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyBYmvit-uw7P_NMDjWLyvFTYwoT7bbeT5g",
   authDomain: "todos-1c531.firebaseapp.com",
   projectId: "todos-1c531",
   storageBucket: "todos-1c531.appspot.com",
   messagingSenderId: "152783773822",
   appId: "1:152783773822:web:0225fa97e9e667ac2cb82f",
   databaseURL: "https://todos-1c531-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;