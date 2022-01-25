import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

function useGetUser(users) {
	const [user] = useAuthState(auth);
	return getRecipientEmail(users, user);
}

export default useGetUser;
