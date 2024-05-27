// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAutF6dKsSF2NgEtZXIBBpxSKSyEQ2M9NY",
  authDomain: "smart-cradle-327e9.firebaseapp.com",
  databaseURL: "https://smart-cradle-327e9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-cradle-327e9",
  storageBucket: "smart-cradle-327e9.appspot.com",
  messagingSenderId: "234497818078",
  appId: "1:234497818078:web:287d6791ef6e2efa93314f",
  measurementId: "G-X5SN16K9ZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);