import {
	collection,
	doc,
	getDocs,
	query,
	getDoc,
	orderBy
} from "firebase/firestore";
import _ from "lodash";
import Head from "next/head";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import ContactInfo from "../../components/ContactInfo";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useMediaQuery } from "@material-ui/core";
import useWindowDimensions from "../../hooks/useWindowDimension";
import { useRouter } from "next/router";
function Chat({ messages, chat }) {
	const [user] = useAuthState(auth);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { width: windowWidth } = useWindowDimensions();
	const router = useRouter();
	const matches = useMediaQuery("(min-width:1100px)");
	const drawerWidth = matches ? 350 : `${windowWidth - 300}`;
	const handleDrawerOpen = () => {
		setDrawerOpen(true);
	};
	const handleDrawerClose = () => {
		setDrawerOpen(false);
	};
	if (!_.includes(JSON.parse(chat)?.users, user.email)) {
		router.push("/401");
		return <div></div>;
	}
	return (
		<Container>
			<Head>
				<title>
					Chat with {getRecipientEmail(JSON.parse(chat).users, user)}
				</title>
			</Head>
			<Sidebar />
			{!(drawerOpen && !matches) && (
				<ChatContainer drawerOpen={drawerOpen}>
					<ChatScreen
						chat={JSON.parse(chat)}
						messages={JSON.parse(messages)}
						handleDrawerOpen={handleDrawerOpen}
					/>
				</ChatContainer>
			)}
			<ContactInfo
				open={drawerOpen}
				chat={JSON.parse(chat)}
				drawerWidth={drawerWidth}
				handleClose={handleDrawerClose}
			/>
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
	::-webkit-scrollbar {
		display: none;
	}
	min-width: 450px;
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* firefox */
	transition: margin 0.25s
		${(props) => (props.drawerOpen ? "ease-out" : "sharp")};
	margin-right: ${(props) => (props.drawerOpen ? `350px` : "0")};
	/* @media (min-width: 1000px) {
	}
	@media (max-width: 1000px) {
		display: ${(props) => (props.drawerOpen ? "none" : "flex")};
	} */
`;
