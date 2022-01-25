module.exports = function getRecipientEmail(users, userLoggedIn) {
	return users?.find((user) => String(user) !== String(userLoggedIn?.email));
};
