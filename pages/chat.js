import Image from "next/image";
import React from "react";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import Placeholder from "../components/Placeholder";
import Head from "next/head";
function chat() {
	return (
		<Container>
			<Head>
				<title>Welcome to whatsapp</title>
			</Head>
			<Sidebar />
			<Placeholder />
		</Container>
	);
}

export default chat;

const Container = styled.div`
	display: flex;
	flex: 1;
	overflow-x: scroll;
`;
