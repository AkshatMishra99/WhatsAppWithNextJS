import { Avatar, IconButton } from "@material-ui/core";
import { collection, doc, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { db } from "../firebase";
import useGetUser from "../hooks/useGetUser";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
function ChatScreen({ chat, messages }) {
	const recipientEmail = useGetUser(chat.users);
	const userRef = query(
		collection(db, "users"),
		where("email", "==", recipientEmail)
	);
	const [recipientUserSnapshot] = useCollection(userRef);
	const recipient = recipientUserSnapshot?.docs?.[0]?.data();
	console.log(recipient);
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
		</Container>
	);
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
	width: 100%;
	position: sticky;
	top: 0;
	background-color: #ededed;
	padding: 15px;
	height: 80px;
	display: flex;
	justify-content: space-between;
	align-items: center;
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
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex: 1;
`;
