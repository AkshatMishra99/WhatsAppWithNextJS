import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { auth } from "../firebase";
function SettingsMenu({ anchorEl, handleClose }) {
	const open = Boolean(anchorEl);
	const signOut = () => {
		auth.signOut();
	};
	return (
		<Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
			<MenuItem>Settings</MenuItem>
			<MenuItem onClick={signOut}>Logout</MenuItem>
		</Menu>
	);
}

export default SettingsMenu;
