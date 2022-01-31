import { Drawer, IconButton } from "@material-ui/core";
import { collection, getDoc, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import ClearIcon from "@material-ui/icons/Clear";
import RecipientProfile from "./RecipientProfile";
import { useCollection } from "react-firebase-hooks/firestore";
import RecipientAbout from "./RecipientAbout";
function ContactInfo({ open, drawerWidth, handleClose, chat }) {
	const [user] = useAuthState(auth);
	const [openBackdrop, setOpenBackdrop] = useState(false);
	const handleBackdropOpen = () => {
		setOpenBackdrop(true);
	};
	const handleBackdropClose = () => {
		setOpenBackdrop(false);
	};
	const recipientEmail = getRecipientEmail(chat?.users, user);
	const userRef = query(
		collection(db, "users"),
		where("email", "==", recipientEmail)
	);
	const handleDrawerClose = (e) => {
		if (e.key === "Escape" && openBackdrop) {
			handleBackdropClose();
		} else {
			handleClose();
		}
	};
	const [recipientSnapshot, loading] = useCollection(userRef);
	const recipient = recipientSnapshot?.docs?.[0]?.data();
	return (
		<Drawer
			anchor="right"
			open={open}
			variant="temporary"
			hideBackdrop={true}
			onClose={handleDrawerClose}
			elevation={1}
		>
			<Container width={drawerWidth} open={open}>
				<Header>
					<IconButton
						style={{ marginRight: "5px" }}
						onClick={handleDrawerClose}
					>
						<ClearIcon />
					</IconButton>
					Contact Info
				</Header>
				<RecipientProfile
					user={recipient}
					loading={loading}
					openBackdrop={openBackdrop}
					handleOpen={handleBackdropOpen}
					handleClose={handleBackdropClose}
				/>
				<RecipientAbout user={recipient} />
			</Container>
		</Drawer>
	);
}

export default ContactInfo;

const grow = keyframes`
    0%{
        height:0;
    }
    100%{
        height:100vh;
    }
`;

const Container = styled.div`
	width: ${(props) => (props.open ? props.width : 0)}px;
	transition: all 0.1s ease-in-out;
	animation: ${grow} 1.5s;
	height: 100vh;
	flex: 1;
	background-color: #ededed;
`;
const Header = styled.div`
	padding: 15px;
	flex: 1;
	font-size: 18px;
`;
