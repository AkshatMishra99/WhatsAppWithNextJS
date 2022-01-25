import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { addDoc, collection, where, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";

function Sidebar() {
	const [user] = useAuthState(auth);
	const userChatRef = query(
		collection(db, "chats"),
		where("users", "array-contains", user?.email)
	);

	const [chatsSnapshot] = useCollection(userChatRef);
	const createChat = async () => {
		const input = prompt(
			"Please enter the email address for the user you want to chat with?"
		);
		if (!input) return;

		if (
			EmailValidator.validate(input) &&
			input !== user?.email &&
			!chatAlreadyExists(input)
		) {
			// we need to add the chat into the 'chat' DB

			await addDoc(collection(db, "chats"), {
				users: [user?.email, input]
			});
		}
	};
	const chatAlreadyExists = (recipientEmail) => {
		const chat = chatsSnapshot?.docs.find(
			(chat) =>
				chat.data().users.filter((user) => user == recipientEmail)
					?.length > 0
		);
		return !!chat;
	};
	const signOut = () => {
		auth.signOut();
	};
	return (
		<Container>
			<Header>
				<UserAvatar
					onClick={signOut}
					alt={user?.name}
					src={user?.photoURL}
				/>
				<IconsContainer>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</IconsContainer>
			</Header>
			<Search>
				<SearchIcon />
				<SearchInput placeholder="Search in chat.." />
			</Search>
			<SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
			{chatsSnapshot?.docs.map((chat) => (
				<Chat key={chat.id} id={chat.id} users={chat.data().users} />
			))}
		</Container>
	);
}

export default Sidebar;

const Container = styled.div`
	/* width: 20%; */
	box-shadow: 1px 0px 20px -3px rgba(0, 0, 0, 0.1);
	height: 100vh;
	min-width: 30%;
	/* position: absolute;
	left: 0; */
`;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 1;
	border-bottom: 1px solid whitesmoke;
	padding: 15px;
	height: 80px;
`;

const UserAvatar = styled(Avatar)`
	margin: 10px;
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`;

const IconsContainer = styled.div`
	margin-right: 2%;
`;

const Search = styled.div`
	width: 100%;
	padding: 20px;
	display: flex;
	align-items: center;
`;

const SearchInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	margin-left: 2%;
`;

const SidebarButton = styled(Button)`
	text-transform: uppercase;
	width: 100%;
	padding: 5%;
	&&& {
		border-bottom: 1px solid whitesmoke;
		border-top: 1px solid whitesmoke;
	}
`;
