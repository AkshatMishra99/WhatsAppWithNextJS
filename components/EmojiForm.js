import { Popover } from "@material-ui/core";
import EmojiPicker, { SKIN_TONE_LIGHT } from "emoji-picker-react";
import React from "react";

function EmojiForm({
	id,
	open,
	anchorEl,
	onClose,
	anchorPosition,
	onEmojiClick
}) {
	return (
		<Popover
			id={id}
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorReference="anchorPosition"
			anchorPosition={anchorPosition}
			anchorOrigin={{
				vertical: "top",
				horizontal: "left"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "left"
			}}
		>
			<EmojiPicker
				onEmojiClick={onEmojiClick}
				skinTone={SKIN_TONE_LIGHT}
			/>
		</Popover>
	);
}

export default EmojiForm;
