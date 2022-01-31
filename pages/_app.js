import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import Loading from "../components/Loading";
import { useCallback, useEffect } from "react";
import {
	doc,
	setDoc,
	serverTimestamp,
	collection,
	getDoc,
	where
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

function MyApp({ Component, pageProps }) {
	const [user, loading] = useAuthState(auth);
	const getUser = useCallback(async () => {
		let update;
		if (user) {
			const userDetails = await getDoc(doc(db, "users", user?.uid));
			if (userDetails && userDetails.data()) {
				update = {
					email: user.email,
					lastSeen: serverTimestamp(),
					name: userDetails.data()?.name,
					about:
						userDetails.data()?.about ||
						"Hey everyone I'm using Whatsapp by Akshat ;)"
				};
			} else {
				update = update = {
					email: user.email,
					lastSeen: serverTimestamp(),
					name: user.displayName,
					photoURL: user.photoURL,
					about: "Hey everyone I'm using Whatsapp by Akshat ;)"
				};
			}
			setDoc(doc(db, "users", user.uid), update, { merge: true });
		}
	}, [user]);
	useEffect(() => {
		getUser();
	}, [getUser]);

	if (loading) return <Loading />;
	if (!user) return <Login />;
	return <Component {...pageProps} />;
}

export default MyApp;
