import _ from "lodash";
import { db } from "../firebase";
const {
	getDocs,
	collection,
	setDoc,
	doc,
	deleteDoc
} = require("firebase/firestore");
module.exports = async function addSeenByAndAvailableTo() {
	const chats = await getDocs(collection(db, "chats"));
	_.forEach(chats?.docs, async (chat) => {
		const id = chat.id;
		console.log(id, chat.data());
		const availableTo = [...chat?.data()?.users];
		const chatRef = doc(db, "chats", id);
		await setDoc(
			chatRef,
			{
				availableTo: availableTo
			},
			{ merge: true }
		);
		const messages = await getDocs(
			collection(doc(db, "chats", id), "messages")
		);

		console.log(messages?.docs);
		_.forEach(messages?.docs, async (message) => {
			const messageId = message.id;
			if (!message.data().message) {
				console.log("ye hai saala");
				deleteDoc(doc(collection(chatRef, "messages"), message.id));
			} else console.log(message, message.id, message.data());
			// if (messageId)
			// 	await setDoc(
			// 		doc(collection(chatRef, "messages"), messageId),
			// 		{ seenBy: availableTo, availableTo: availableTo },
			// 		{ merge: true }
			// 	);
		});
	});
};
