// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyA6oDTW4mGG3ie12LT_NSxB2KHhUcbJydk",
	authDomain: "whatsapp-enhanced.firebaseapp.com",
	projectId: "whatsapp-enhanced",
	storageBucket: "whatsapp-enhanced.appspot.com",
	messagingSenderId: "1042134068534",
	appId: "1:1042134068534:web:dcaca637390491e79f9797",
	measurementId: "G-9ZWE4CFBWG"
};

// Initialize Firebase
let app;
if (!firebase.apps.length) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app(); // if already initialized, use that one
}

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
