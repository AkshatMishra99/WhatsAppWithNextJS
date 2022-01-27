import Image from "next/image";
import React from "react";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
function chat() {
	return (
		<Container>
			<Sidebar />
			<ImageElement>
				<ImageContent alt="placeholder" src="/images/chat.png" />
			</ImageElement>
		</Container>
	);
}

export default chat;

const Container = styled.div`
	display: flex;
	flex: 1;
`;
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
