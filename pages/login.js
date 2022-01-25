import { Button } from "@material-ui/core";
import { signInWithPopup } from "firebase/auth";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";
function Login() {
	const signIn = () => {
		signInWithPopup(auth, provider)
			.then((result) => console.log(result))
			.catch(alert);
	};
	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>
			<LoginContainer>
				<Logo src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
				<Button onClick={signIn}>Sign in with google</Button>
			</LoginContainer>
		</Container>
	);
}
const Container = styled.div`
	display: grid;
	place-items: center;
	height: 100vh;
	background-color: whitesmoke;
`;

const LoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	background-color: white;
	align-items: center;
	padding: 100px;
	border-radius: 5px;
	box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.4);
`;

const Logo = styled.img`
	width: 200px;
	margin-bottom: 20px;
`;

export default Login;
