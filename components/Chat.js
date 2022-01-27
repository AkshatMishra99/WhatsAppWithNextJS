import React from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { auth, db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router";

function Chat(props) {
	const { users, id } = props;
	const [user] = useAuthState(auth);
	const router = useRouter();
	const recipientEmail = getRecipientEmail(users, user);
	let userDetails;
	const userRef = query(
		collection(db, "users"),
		where("email", "==", recipientEmail)
	);
	const [userSnapshot] = useCollection(userRef);
	if (userSnapshot && userSnapshot?.docs && userSnapshot.docs.length > 0) {
		userDetails = userSnapshot?.docs[0].data();
	}
	const createChat = () => {
		router.push(`/chat/${id}`);
	};
	return (
		<Container onClick={createChat}>
			{userDetails?.photoURL ? (
				<UserAvatar
					alt={userDetails?.name}
					src={userDetails?.photoURL}
				/>
			) : (
				<UserAvatar>{recipientEmail[0]}</UserAvatar>
			)}
			<EmailContainer>{recipientEmail}</EmailContainer>
		</Container>
	);
}

export default Chat;

const Container = styled.div`
	width: 100%;
	padding: 1%;
	background-color: white;
	display: flex;
	justify-content: flex-start;
	cursor: pointer;
	word-break: break-word;
	align-items: center;
	:hover {
		background-color: #e9eaeb;
	}
`;

const UserAvatar = styled(Avatar)`
	margin: 10px;
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`;

const EmailContainer = styled.div`
	margin-left: 10px;
`;
