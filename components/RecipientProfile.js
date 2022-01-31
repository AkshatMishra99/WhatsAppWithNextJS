import { Backdrop, IconButton } from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";
import Image from "next/image";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
function RecipientProfile({
	user,
	loading,
	openBackdrop,
	handleOpen,
	handleClose
}) {
	return (
		<Container>
			<ImageSection loading={loading}>
				<ImageEl
					alt="Profile Picture"
					src={
						user?.photoURL
							? user?.photoURL
							: "/images/profilepic.svg"
					}
					width="200px"
					height="200px"
					onClick={handleOpen}
				/>
			</ImageSection>
			<InfoSection>
				<NameSection>{user?.name}</NameSection>
				<EmailSection>{user?.email}</EmailSection>
			</InfoSection>
			<Backdrop
				style={{
					backgroundColor: "rgba(255, 255, 255, 0.9)",
					zIndex: "110",
					display: "flex",
					flexDirection: "column"
				}}
				open={openBackdrop && user?.photoURL}
				onClick={handleClose}
			>
				<Close>
					<IconButton onClick={handleClose}>
						<Clear />
					</IconButton>
				</Close>
				<FullImage photoURL={user?.photoURL}></FullImage>
			</Backdrop>
		</Container>
	);
}

export default RecipientProfile;

const grow = keyframes`
    from{
        transform:translateY(-100px);
        opacity:0;
    }
    to{
        transform:translateY(0);
        opacity:1;
    }
`;

const Container = styled.div`
	flex: 1;
	max-height: ${(props) => (Boolean(props.loading) ? "0" : "fit-content")};
	transition: height 0.5s ease-out;
	background: white;
	padding: 10px;
	animation: ${grow} 0.5s;
	margin-bottom: 20px;
`;

const ImageSection = styled.div`
	padding: 20px;
	transition: transform 0.5s ease-in;
	height: ${(props) => (props.loading ? "0" : "fit-content")};
	display: flex;
	justify-content: center;
`;

const ImageEl = styled(Image)`
	border-radius: 100px;
	cursor: pointer;
`;

const FullImage = styled.div`
	background-image: url(${(props) => (props.photoURL ? props.photoURL : "")});
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	height: 90vh;
	margin: auto;
	min-width: 40%;
`;

const Close = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: flex-end;
`;

const InfoSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const EmailSection = styled.div`
	color: #667781;
	font-size: 16px;
`;

const NameSection = styled.div`
	color: #3b4a54;
	font-size: 24px;
`;
