import React from "react";
import styled from "styled-components";

function Placeholder() {
	return (
		<ImageElement>
			<ImageContent alt="placeholder" src="/images/chat.png" />
		</ImageElement>
	);
}

export default Placeholder;
const ImageElement = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
	padding: 0 20px;
`;

const ImageContent = styled.img`
	width: 250px;
	margin: auto;
`;
