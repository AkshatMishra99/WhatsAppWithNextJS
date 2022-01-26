import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { auth } from "../firebase";
function Message({ message }) {
	console.log(message);
	const [user] = useAuthState(auth);
	const timestamp = moment(message?.timestamp).format("h:mm a");
	console.log(timestamp);
	return (
		<Container userSelf={message.user === user.email}>
			<MessageContainer userSelf={message.user === user.email}>
				<MessageContent>{message.message}</MessageContent>
				<Timestamp>{timestamp}</Timestamp>
			</MessageContainer>
		</Container>
	);
}

export default Message;

const Container = styled.div`
	display: flex;
	justify-content: ${(props) => (props.userSelf ? "flex-end" : "flex-start")};
	width: 100%;
`;

const MessageContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 5px;
	background-color: ${(props) => (props.userSelf ? "#d9fdd3" : "whitesmoke")};
	margin: 10px 8%;
	max-width: 60%;
	width: max-content;
`;

const MessageContent = styled.div`
	padding: 10px;
	word-break: break-word;
	/* flex: 1; */
`;
const Timestamp = styled.div`
	font-size: 12px;
	margin-right: 5px;
	margin-top: 10%;
	text-align: right;
	color: gray;
	min-width: 60px;
	/* flex: 1; */
`;
