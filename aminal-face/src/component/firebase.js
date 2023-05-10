// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import {getFirestore} from "@firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmsd3hCd9TsDt-zrgBag1_yYBp9wH5yjs",
  authDomain: "animalproject-7b10f.firebaseapp.com",
  projectId: "animalproject-7b10f",
  storageBucket: "animalproject-7b10f.appspot.com",
  messagingSenderId: "908930701430",
  appId: "1:908930701430:web:108cf541f0358832862757",
  measurementId: "G-78PP8Y0MNV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);