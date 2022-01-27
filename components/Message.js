import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { auth } from "../firebase";
function Message({ user, message }) {
	const [userLoggedIn] = useAuthState(auth);
	const timestamp = moment(message?.timestamp).format("h:mm a");
	const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
	return (
		<Container userSelf={message.user === userLoggedIn.email}>
			<TypeOfMessage userSelf={message.user === userLoggedIn.email}>
				<MessageContent>
					{message.message}
					<Timestamp>
						{message?.timestamp ? timestamp : "..."}
					</Timestamp>
				</MessageContent>
			</TypeOfMessage>
		</Container>
	);
}

export default Message;

const Container = styled.div``;

const MessageContainer = styled.p`
	/* display: flex;
	justify-content: space-between;
	align-items: center; */
	border-radius: 8px;
	margin: 10px 8%;
	max-width: 60%;
	min-width: 60px;
	width: fit-content;
	position: relative;
	text-align: right;
	padding: 10px;
	padding-bottom: 26px;
`;

const Sender = styled(MessageContainer)`
	margin-left: auto;
	background-color: #dcf8c6;
`;
const Receiver = styled(MessageContainer)`
	background-color: whitesmoke;
	text-align: left;
`;

const MessageContent = styled.div`
	word-break: break-word;
	/* flex: 1; */
`;
const Timestamp = styled.span`
	font-size: 9px;
	padding: 10px;
	position: absolute;
	bottom: 0;
	right: 0;
	text-align: right;
	color: gray;
	/* flex: 1; */
`;
