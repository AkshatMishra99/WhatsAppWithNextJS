import React from "react";
import styled from "styled-components";
import NameForm from "./NameForm";
import AboutForm from "./AboutForm";
function UserDetails({
	isNameEditing,
	setIsNameEditing,
	isAboutEditing,
	setIsAboutEditing
}) {
	return (
		<Container>
			<NameForm
				isEditing={isNameEditing}
				setIsEditing={setIsNameEditing}
			/>
			<AboutForm
				isEditing={isAboutEditing}
				setIsEditing={setIsAboutEditing}
			/>
		</Container>
	);
}

export default UserDetails;

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;
