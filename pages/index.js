import Head from "next/head";
import styled from "styled-components";
import Placeholder from "../components/Placeholder";
import Sidebar from "../components/Sidebar";

export default function Home() {
	return (
		<Container>
			<Head>
				<title>WhatsApp 2.0</title>
				<meta name="description" content="Created by yours truly." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Sidebar />
			<Placeholder />
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex: 1;
`;
