module.exports = function getRecipientEmail(users, userLoggedIn) {
	return users?.find((user) => user !== userLoggedIn?.email);
};
