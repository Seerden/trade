import { User } from "../hooks/auth/state/user.atom";

function setLocalStorageUser(user: User) {
	localStorage.setItem("user", JSON.stringify(user));
}

function getLocalStorageUser() {
	return JSON.parse(localStorage.getItem("user")) as User;
}

function deleteLocalStorageUser() {
	localStorage.removeItem("user");
}

const localStorageUser = {
	set: setLocalStorageUser,
	get: getLocalStorageUser,
	delete: deleteLocalStorageUser,
};

export default localStorageUser;
