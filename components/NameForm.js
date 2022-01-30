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
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import dynamic from "next/dynamic";
const CustomEmojiPicker = dynamic(() => import("./EmojiForm"), {
	ssr: false
});
function NameForm({ isEditing, setIsEditing }) {
	const [user] = useAuthState(auth);
	const [name, setName] = useState("");
	const [text, setText] = useState(name);
	const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
	const [leftCount, setLeftCount] = useState(Math.max(25 - name.length, 0));
	const getUserDetails = useCallback(async () => {
		if (user) {
			const docRef = doc(db, "users", user?.uid);
			const userDoc = await getDoc(docRef);
			setName(userDoc?.data()?.name || user?.displayName);
			setText(userDoc?.data()?.name || user?.displayName);
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
		if (text.length < 26) {
			await setDoc(
				doc(db, "users", user?.uid),
				{
					name: text.slice(0, 26)
				},
				{ merge: true }
			);
			setName(text.slice(0, 26));
			setIsEditing(false);
		}
	};
	const handleEmojiOpen = (e) => {
		setEmojiAnchorEl(e.currentTarget);
	};
	const handleEmojiClose = (e) => {
		setEmojiAnchorEl(null);
	};
	const onEmojiClick = (e, emojiObject) => {
		console.log(emojiObject.emoji);
		setText((text) => `${text}${emojiObject.emoji}`);
	};
	const open = Boolean(emojiAnchorEl);
	const id = open ? "emoji-popover" : undefined;
	return (
		<Container>
			<Label>Your Name</Label>
			{!isEditing && (
				<DetailContainer>
					<TextContainer>{name}</TextContainer>
					<IconButton
						onClick={() => {
							setIsEditing(true);
						}}
					>
						<EditIcon />
					</IconButton>
				</DetailContainer>
			)}
			<CustomEmojiPicker
				id={id}
				open={open}
				anchorEl={emojiAnchorEl}
				onClose={handleEmojiClose}
				onEmojiClick={onEmojiClick}
				anchorPosition={{ top: 150, left: 300 }}
			/>
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
									<Tooltip title="Insert Emoji">
										<InsertEmoticon
											onClick={handleEmojiOpen}
											aria-describedby={id}
										/>
									</Tooltip>
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
	margin-bottom: 30%;
`;

const Label = styled.div`
	color: #008069;
	margin-bottom: 20px;
`;

const InsertEmoticon = styled(InsertEmoticonIcon)`
	cursor: pointer;
	margin: 0 5px;
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
