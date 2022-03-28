import localStorageUser from "helpers/local-storage-user";
import { atom } from "recoil";

// @todo: this should become the type for authenticated users - so no password, but perhaps creation date, role, etc.
export type User = {
	username: string;
};

export const userState = atom<User>({
	default: {
		username: localStorageUser.get()?.username ?? ""
	},
	key: "auth/user"
});
