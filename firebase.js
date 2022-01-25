// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyD8G54HDQuWsKcpqpr4Lyq5GCgY1ZGcbw0",
	authDomain: "whatsapp-2-6e816.firebaseapp.com",
	databaseURL: "https://whatsapp-2-6e816-default-rtdb.firebaseio.com",
	projectId: "whatsapp-2-6e816",
	storageBucket: "whatsapp-2-6e816.appspot.com",
	messagingSenderId: "911412677324",
	appId: "1:911412677324:web:7d93624713b82e58d2d069"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
