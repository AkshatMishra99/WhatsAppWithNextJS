import { IconButton, SwipeableDrawer } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ProfileForm from "./ProfileForm";
function Profile({ anchor, onClose }) {
	const open = Boolean(anchor);
	return (
		<SwipeableDrawer anchor={"left"} open={open} onClose={onClose}>
			<Container>
				<Header>
					<NavigationContainer>
						<IconButton onClick={onClose}>
							<ArrowBack />
						</IconButton>
						<h2>Profile</h2>
					</NavigationContainer>
				</Header>
				<ProfileForm />
			</Container>
		</SwipeableDrawer>
	);
}

export default Profile;

const Container = styled.div`
	width: 300px;
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f0f2f5;
`;

const Header = styled.div`
	position: sticky;
	/* padding: 20px 20px 5px; */
	display: flex;
	align-items: flex-end;
	width: 100%;
	background-color: #008069;
	height: 25%;
`;

const NavigationContainer = styled.div`
	padding: 10px;
	flex: 1;
	display: flex;
	align-items: center;
	> h2 {
		margin: 0;
		color: white;
		margin-left: 10%;
	}
`;
const ArrowBack = styled(ArrowBackIcon)`
	color: white;
`;
