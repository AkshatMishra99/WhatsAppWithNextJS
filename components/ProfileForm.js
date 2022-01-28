import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import CameraAlt from "@material-ui/icons/CameraAlt";
import {
	Box,
	CircularProgress,
	Menu,
	MenuItem,
	Tooltip
} from "@material-ui/core";
import { useCallback, useState, useEffect } from "react";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL
} from "firebase/storage";
import { collection, doc, query, setDoc, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

function ProfileForm() {
	const [user] = useAuthState(auth);
	const [photoURL, setPhotoURL] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [isPhotoUploading, setIsPhotoUploading] = useState(null);
	const [progress, setProgress] = useState(null);

	const [userSnapshot] = useCollection(
		query(collection(db, "users"), where("email", "==", user?.email))
	);
	const setUser = useCallback(async () => {
		if (userSnapshot && userSnapshot?.docs?.[0]?.data()) {
			setPhotoURL(userSnapshot?.docs?.[0]?.data()?.photoURL);
		}
	}, [userSnapshot]);
	useEffect(() => {
		setUser();
	}, [setUser]);

	// creating a storage on firebase
	const storage = getStorage();

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const open = Boolean(anchorEl);

	const handleImageSelect = (e) => {
		console.log(e.target.files[0], e);
		const file = e.target?.files?.[0];
		if (file) {
			// reader.readAsDataURL(file);
			const storageRef = ref(storage, `images/${Date.now()}${file.name}`);
			setPhotoURL(URL.createObjectURL(file));
			const uploadTask = uploadBytesResumable(storageRef, file);
			handleClose();
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					setIsPhotoUploading(true);

					console.log(snapshot);
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setProgress(
						snapshot.bytesTransferred / snapshot.totalBytes
					) * 100;
					console.log("Upload is " + progress + "% done");
				},
				(error) => {
					// Handle unsuccessful uploads
					setIsPhotoUploading(false);
					console.log(error);
				},
				() => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					getDownloadURL(uploadTask.snapshot.ref).then(
						(downloadURL) => {
							console.log("File available at", downloadURL);
							setDoc(
								doc(db, "users", user.uid),
								{
									photoURL: downloadURL
								},
								{
									merge: true
								}
							);
						}
					);
					setIsPhotoUploading(false);
				}
			);
		}
	};
	console.log(photoURL);
	return (
		<Container>
			<ImageContainer src={photoURL}>
				<ImageOverlay
					type="file"
					name="imageUpload"
					id="img-overlay"
					onClick={handleClick}
					aria-controls={open ? "basic-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
				>
					<Box>
						<Tooltip title="Profile Pic">
							<CameraAlt
								style={{
									fontSize: 40,
									margin: "40%",
									color: "white"
								}}
							/>
						</Tooltip>
					</Box>
				</ImageOverlay>
				<Menu
					open={open}
					anchor={anchorEl}
					onClose={handleClose}
					id="basic-menu"
					MenuListProps={{
						"aria-labelledby": "img-overlay"
					}}
				>
					<MenuItem>
						<form action=""></form>
						<input
							type="file"
							id="fileDialogId"
							style={{
								opacity: 0,
								width: "100%",
								position: "absolute"
							}}
							onChange={handleImageSelect}
						/>
						Upload Photo
					</MenuItem>
					<MenuItem>Remove Photo</MenuItem>
				</Menu>
			</ImageContainer>
			{isPhotoUploading && (
				<ProgressContainer>
					<CircularProgress />
				</ProgressContainer>
			)}
		</Container>
	);
}

export default ProfileForm;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* firefox */
`;

const ImageContainer = styled.div`
	border-radius: 100px;
	height: 200px;
	width: 200px;
	display: flex;
	justify-content: center;
	margin: 10% auto;
	position: relative;
	background-image: url(${(props) => (props.src ? props.src : "")});
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
`;

const ProgressContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

const ImageOverlay = styled.div`
	opacity: 0;
	z-index: 101;
	height: 200px;
	width: 200px;
	margin: 0 -200px;
	border-radius: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	:hover {
		display: block;
		opacity: 1;
		background-color: rgba(0, 0, 0, 0.4);
	}
`;

const I = styled.div`
	margin: auto;
	position: absolute;
	color: white;
	bottom: 100px;
	left: 0;
	text-align: center;
	right: 0;
	padding: 6px;
	opacity: 0;
	transition: all 0.5s linear;
	z-index: 102;

	:after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 0px;
		background: rgba(0, 0, 0, 0.3);
		z-index: 101;
		transition: height 0.3s;
	}
`;
