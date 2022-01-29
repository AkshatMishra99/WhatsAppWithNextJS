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
	const [leftCount, setLeftCount] = useState(Math.max(25 - about.length, 0));
	const getUserDetails = useCallback(async () => {
		if (user) {
			const docRef = doc(db, "users", user?.uid);
			const userDoc = await getDoc(docRef);
			setAbout(userDoc?.data()?.about || "");
			setText(userDoc?.data()?.about || "");
		}
	}, [user]);
	useEffect(getUserDetails, [getUserDetails]);

	useEffect(() => {
		setLeftCount(Math.max(25 - text.length, 0));
	}, [text]);

	const handleChange = (e) => {
		const value = e.target.value;
		if (value.length <= 25) {
			setText(String(value).slice(0, 25));
		}
	};

	const handleSave = async (e) => {
		console.log("this is saved ", text);
		if (text.length < 26 || text.length > 0) {
			setIsEditing(false);
			await setDoc(
				doc(db, "users", user?.uid),
				{
					about: text.slice(0, 26)
				},
				{ merge: true }
			);
			setAbout(text.slice(0, 26));
		}
	};
	const handlePressEsc = (e) => {
		console.log(e.key);
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
									<LeftCount>{leftCount}</LeftCount>
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
						onKeyPress={handlePressEsc}
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
