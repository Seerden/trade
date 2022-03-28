import localStorageUser from "helpers/local-storage-user";
import { useMemo } from "react";
import { useRecoilState } from "recoil";
import { User, userState } from "./state/user.atom";

export function useAuth() {
	const [user, setUser] = useRecoilState(userState);

	// @todo: this could also be a Recoil selector
	const isLoggedIn = useMemo(() => {
		return user.username.length > 0;
	}, [user]);

	function login(user: User): void {
		if (!user?.username) {
			return;
		}

		// set user atom
		setUser(user);

		// set user in local storage
		localStorageUser.set(user);
	}

	// @todo: could also use resetRecoilState
	function logout(): void {
		// reset user atom
		setUser({
			username: ""
		});

		// remove user from local storage
		localStorageUser.delete();
	}

	return {
		user,
		login,
		logout,
		isLoggedIn
	} as const;
}
