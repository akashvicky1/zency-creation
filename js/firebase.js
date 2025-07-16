// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZLrF220ViXqBaYV7nB8aDZEFuO51niZg",
  authDomain: "zency-creation-project.firebaseapp.com",
  projectId: "zency-creation-project",
  storageBucket: "zency-creation-project.firebasestorage.app",
  messagingSenderId: "281015807301",
  appId: "1:281015807301:web:7330f1622afa970298622c",
  measurementId: "G-BYZ982SG4P"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
