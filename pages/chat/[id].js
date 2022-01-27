import {
	collection,
	doc,
	getDocs,
	query,
	getDoc,
	orderBy
} from "firebase/firestore";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ messages, chat }) {
	const [user] = useAuthState(auth);
	return (
		<Container>
			<Head>
				<title>
					Chat with {getRecipientEmail(JSON.parse(chat).users, user)}
				</title>
			</Head>
			<Sidebar />
			<ChatContainer>
				<ChatScreen
					chat={JSON.parse(chat)}
					messages={JSON.parse(messages)}
				/>
			</ChatContainer>
		</Container>
	);
}

export default Chat;

export async function getServerSideProps(context) {
	const ref = doc(db, "chats", context.query.id);
	// PREP the messages on the server
	const messagesRes = await getDocs(
		query(collection(ref, "messages"), orderBy("timestamp"))
	);
	const messages = messagesRes?.docs
		?.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
		.map((message) => ({
			...message,
			timestamp: message.timestamp?.toDate().getTime()
		}));
	// PREP the chats
	const chatRes = await getDoc(ref);
	const chat = {
		id: chatRes.id,
		...chatRes.data()
	};

	return {
		props: {
			messages: JSON.stringify(messages),
			chat: JSON.stringify(chat)
		}
	};
}

const Container = styled.div`
	display: flex;
	overflow: auto;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* firefox */
	/* min-width: 650px; */
`;

const ChatContainer = styled.div`
	flex: 1;
	overflow: scroll;
	height: 100vh;
	min-width: 450px;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* firefox */
`;
