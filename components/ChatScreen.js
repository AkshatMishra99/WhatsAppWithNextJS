import { Avatar, IconButton, Popover } from "@material-ui/core";
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
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { useRef } from "react";
import dynamic from "next/dynamic";
const CustomEmojiPicker = dynamic(() => import("./EmojiForm"), {
	ssr: false
});

function ChatScreen({ chat, messages, handleDrawerOpen }) {
	const [user] = useAuthState(auth);
	const recipientEmail = getRecipientEmail(chat.users, user);
	const endOfMessageRef = useRef(null);
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
	useEffect(() => {
		scrollToBottom();
	}, [recipient]);
	const showMessages = () => {
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
		} else {
			return messages.map((message) => (
				<Message
					message={message}
					user={message.user}
					key={message.id}
				/>
			));
		}
	};
	const [isEntering, setIsEntering] = useState(false);
	const [textInput, setTextInput] = useState("");

	const [anchorEl, setAnchorEl] = useState(null);
	useEffect(() => {
		if (textInput) {
			setIsEntering(true);
		} else {
			setIsEntering(false);
		}
	}, [textInput]);
	// useEffect(() => {
	// 	scrollToBottom();
	// }, []);
	const onTextChange = (e) => {
		setTextInput(e.target.value);
	};

	const scrollToBottom = (e) => {
		endOfMessageRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const sendMessage = (e) => {
		e.preventDefault();
		if (!textInput) return;
		// update the last seen
		setDoc(
			doc(collection(db, "users"), user.uid),
			{
				lastSeen: serverTimestamp()
			},
			{ merge: true }
		);
		// add the message in the chats
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
		scrollToBottom();
	};
	const onEmojiClick = (e, emojiObj) => {
		console.log(emojiObj, emojiObj.emoji);
		setTextInput((textInput) => {
			return `${textInput}${emojiObj.emoji}`;
		});
	};
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	const handleClick = (e) => {
		setAnchorEl(endOfMessageRef.current);
	};
	const handleEmojiClose = () => {
		setAnchorEl(null);
	};
	return (
		<Container>
			<Header>
				<RecipientContainer onClick={handleDrawerOpen}>
					{recipient ? (
						<UserAvatar src={recipient.photoURL} />
					) : (
						<UserAvatar>{recipientEmail[0]}</UserAvatar>
					)}
					<RecipientName>
						<RecipientHeading>
							{recipient ? recipient.name : recipientEmail}
						</RecipientHeading>
						{recipientUserSnapshot ? (
							<LastSeen>
								Last Active:{" "}
								{recipient?.lastSeen?.toDate() ? (
									<TimeAgo
										datetime={recipient?.lastSeen?.toDate()}
									/>
								) : (
									"Unavailable"
								)}
							</LastSeen>
						) : (
							<LastSeen>Loading last seen...</LastSeen>
						)}
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
			<MessageContainer>
				{showMessages()}
				<EndOfMessage ref={endOfMessageRef} />
			</MessageContainer>
			<CustomEmojiPicker
				id={id}
				anchorEl={anchorEl}
				open={open}
				onClose={handleEmojiClose}
				anchorPosition={{ top: 350, left: 300 }}
				onEmojiClick={onEmojiClick}
			/>
			<InputContainer disabled={!textInput} onSubmit={sendMessage}>
				<IconButton onClick={handleClick} aria-describedby={id}>
					<InsertEmoticonIcon />
				</IconButton>
				<Input
					placeholder="Type a message"
					onChange={onTextChange}
					value={textInput}
					autoFocus
					onFocus={function (e) {
						var val = e.target.value;
						e.target.value = "";
						e.target.value = val;
					}}
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
	min-height: 90vh;
	padding: 30px;
	padding-top: 90px;
	overflow: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* firefox */
`;

const EndOfMessage = styled.div`
	margin-bottom: 50px;
`;

const InputContainer = styled.form`
	position: sticky;
	bottom: 0;
	background-color: #ededed;
	padding: 10px;
	display: flex;
	align-items: center;
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
	align-items: center;
	margin: 0 15px;
	position: sticky;
	bottom: 0;
`;

const Container = styled.div``;

const Header = styled.div`
	width: 100%;
	position: sticky;
	top: 0;
	z-index: 100;
	background-color: #ededed;
	padding: 11px;
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
	cursor: pointer;
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
	/* flex: 1; */
`;
