import { Drawer, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ProfileForm from "./ProfileForm";
import UserDetails from "./UserDetails";
function Profile({ anchor, onClose }) {
	const open = Boolean(anchor);
	const [isNameEditing, setIsNameEditing] = useState(false);
	const [isAboutEditing, setIsAboutEditing] = useState(false);
	return (
		<Drawer
			anchor={"left"}
			open={open}
			hideBackdrop={true}
			// ModalProps={{
			// 	keepMounted: true
			// }}
			onClose={(e) => {
				if (e.type === "keydown" && e.code === "Escape") {
					if (!isNameEditing && !isAboutEditing) {
						onClose();
					} else if (isNameEditing) {
						setIsNameEditing(false);
					} else if (isAboutEditing) {
						setIsAboutEditing(false);
					}
				} else {
					onClose();
				}
			}}
		>
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
				<UserDetails
					isNameEditing={isNameEditing}
					setIsNameEditing={setIsNameEditing}
					isAboutEditing={isAboutEditing}
					setIsAboutEditing={setIsAboutEditing}
				/>
			</Container>
		</Drawer>
	);
}

export default Profile;

const Container = styled.div`
	width: 300px;
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f0f2f5;
	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* firefox */
`;

const Header = styled.div`
	position: sticky;
	top: 0;
	z-index: 105;
	/* padding: 20px 20px 5px; */
	display: flex;
	align-items: flex-end;
	width: 100%;
	background-color: #008069;
	height: 15%;
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
