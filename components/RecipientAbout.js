import React from "react";
import styled from "styled-components";

function RecipientAbout({ user }) {
	return (
		<AboutContainer>
			<AboutHeading>About</AboutHeading>
			<AboutContent>
				{user?.about ? user.about : "Not Available"}
			</AboutContent>
		</AboutContainer>
	);
}

export default RecipientAbout;
const AboutContainer = styled.div`
	background-color: white;
	padding: 17px 30px 19px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`;
const AboutHeading = styled.div`
	color: #667781;
	margin-bottom: 5px;
`;
const AboutContent = styled.div`
	color: #111b21;
	font-size: 17px;
`;
