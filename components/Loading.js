import { CircularProgress } from "@material-ui/core";
import Image from "next/image";
import { Circle } from "better-react-spinkit";

function Loading() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				height: "100vh",
				alignItems: "center"
			}}
		>
			<div style={{ marginBottom: "20px" }}>
				<Image
					src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
					alt=""
					width="200px"
					height="200px"
				/>
			</div>
			<Circle size={60} color="#3cbc28" />
		</div>
	);
}

export default Loading;
