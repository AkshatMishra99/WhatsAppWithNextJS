import {
	IconButton,
	InputAdornment,
	TextField,
	Tooltip
} from "@material-ui/core";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
function NameForm({ isEditing, setIsEditing }) {
	const [user] = useAuthState(auth);
	const [about, setAbout] = useState("");
	const [text, setText] = useState(about);
	const getUserDetails = useCallback(async () => {
		if (user) {
			const docRef = doc(db, "users", user?.uid);
			const userDoc = await getDoc(docRef);
			setAbout(userDoc?.data()?.about || "");
			setText(userDoc?.data()?.about || "");
		}
	}, [user]);
	useEffect(getUserDetails, [getUserDetails]);

	const handleChange = (e) => {
		const value = e.target.value;
		if (value.length <= 25) {
			setText(String(value));
		}
	};

	const handleSave = async (e) => {
		if (text.length > 0) {
			setIsEditing(false);
			await setDoc(
				doc(db, "users", user?.uid),
				{
					about: text.slice(0, 26)
				},
				{ merge: true }
			);
			setAbout(text);
		}
	};
	return (
		<Container>
			<Label>About</Label>
			{!isEditing && (
				<DetailContainer>
					<TextContainer>{about}</TextContainer>
					<IconButton
						onClick={() => {
							setIsEditing(true);
						}}
					>
						<EditIcon />
					</IconButton>
				</DetailContainer>
			)}

			{isEditing && (
				<DetailForm>
					<TextField
						value={text}
						onChange={handleChange}
						multiline
						variant="standard"
						autoFocus={true}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Tooltip title="Click to save, ESC to cancel">
										<CheckIconButton onClick={handleSave} />
									</Tooltip>
								</InputAdornment>
							)
						}}
						onFocus={function (e) {
							var val = e.target.value;
							e.target.value = "";
							e.target.value = val;
						}}
					/>
				</DetailForm>
			)}
		</Container>
	);
}

export default NameForm;

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 20px 10px 20px 30px;
	background-color: white;
	box-shadow: 0px 1px 10px -10px rgba(0, 0, 0, 0.4);
`;

const Label = styled.div`
	color: #008069;
	margin-bottom: 20px;
`;

const DetailContainer = styled.div`
	display: flex;
`;

const TextContainer = styled.div`
	flex: 1;
	align-items: center;
	display: flex;
	padding-bottom: 5px;
	font-size: 18px;
`;

const LeftCount = styled.p`
	color: #d1d7db;
	margin-right: 5px;
`;
const CheckIconButton = styled(CheckIcon)`
	cursor: pointer;
`;

const DetailForm = styled.div``;
