import { Avatar, IconButton } from "@material-ui/core";
import {
	collection,
	doc,
	query,
	where,
	orderBy,
	serverTimestamp,
	setDoc,
	addDoc
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import useGetUser from "../hooks/useGetUser";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
function ChatScreen({ chat, messages }) {
	const [user] = useAuthState(auth);
	const recipientEmail = useGetUser(chat.users);
	const userRef = query(
		collection(db, "users"),
		where("email", "==", recipientEmail)
	);
	const [recipientUserSnapshot] = useCollection(userRef);
	const recipient = recipientUserSnapshot?.docs?.[0]?.data();

	const router = useRouter();
	const [messagesSnapshot] = useCollection(
		query(
			collection(
				doc(collection(db, "chats"), router.query.id),
				"messages"
			),
			orderBy("timestamp", "asc")
		)
	);
	const showMessages = () => {
		console.log(messagesSnapshot);
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map((doc) => (
				<Message
					key={doc.id}
					user={doc?.data()?.user}
					message={{
						...doc?.data(),
						timestamp: doc?.data()?.timestamp?.toDate().getTime()
					}}
				/>
			));
		}
	};
	const [isEntering, setIsEntering] = useState(false);
	const [textInput, setTextInput] = useState("");
	useEffect(() => {
		if (textInput) {
			setIsEntering(true);
		} else {
			setIsEntering(false);
		}
	}, [textInput]);
	const onTextChange = (e) => {
		setTextInput(e.target.value);
	};
	const sendMessage = (e) => {
		e.preventDefault();
		if (!textInput) return;
		console.log("clicked");
		// update the last seen
		setDoc(
			doc(collection(db, "users"), user.uid),
			{
				lastSeen: serverTimestamp()
			},
			{ merge: true }
		);
		console.log(user.photoURL);
		addDoc(
			collection(
				doc(collection(db, "chats"), router.query.id),
				"messages"
			),
			{
				timestamp: serverTimestamp(),
				message: textInput,
				user: user?.email,
				photoURL: user.photoURL ? user.photoURL : ""
			}
		);
		setTextInput("");
	};
	return (
		<Container>
			<Header>
				<RecipientContainer>
					{recipient ? (
						<UserAvatar src={recipient.photoURL} />
					) : (
						<UserAvatar />
					)}
					<RecipientName>
						<RecipientHeading>
							{recipient ? recipient.name : recipientEmail}
						</RecipientHeading>
						<LastSeen>Just now</LastSeen>
					</RecipientName>
				</RecipientContainer>
				<ButtonContainer>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</ButtonContainer>
			</Header>
			<MessageContainer>{showMessages()}</MessageContainer>
			<InputContainer disabled={!textInput} onSubmit={sendMessage}>
				<IconButton>
					<InsertEmoticonIcon />
				</IconButton>
				<Input
					placeholder="Type a message"
					onChange={onTextChange}
					value={textInput}
				/>
				{isEntering && (
					<IconButton
						disabled={!textInput}
						type="submit"
						onClick={sendMessage}
					>
						<SendIcon />
					</IconButton>
				)}
				{!isEntering && (
					<IconButton>
						<MicIcon />
					</IconButton>
				)}
			</InputContainer>
		</Container>
	);
}

export default ChatScreen;

const MessageContainer = styled.div`
	flex: 1;
	height: 80vh;
	overflow: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* firefox */
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
	position: sticky;
	bottom: 0;
	background-color: #ededed;
	padding: 10px;
	display: flex;
	width: 100%;
	z-index: 100;
`;

const Input = styled.input`
	border-radius: 10px;
	outline: none;
	border: none;
	padding: 20px;
	flex: 1;
	background-color: white;
	margin: 0 15px;
`;

const Container = styled.div``;

const Header = styled.div`
	width: 100%;
	position: sticky;
	top: 0;
	z-index: 100;
	background-color: #ededed;
	padding: 15px;
	height: 80px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid whitesmoke;
`;

const RecipientContainer = styled.div`
	display: flex;
	flex: 1;
	justify-content: flex-start;
	align-items: center;
`;

const UserAvatar = styled(Avatar)`
	cursor: pointer;
	margin-right: 14px;
`;

const RecipientName = styled.div`
	padding: 1%;
	display: flex;
	flex-direction: column;
`;

const RecipientHeading = styled.div`
	font-weight: 700;
	font-size: 18px;
`;

const LastSeen = styled.div`
	font-style: italic;
	color: gray;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex: 1;
`;
