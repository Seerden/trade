import axios from "axios";
import { useAuth } from "hooks/auth/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

// @todo: is there already a type for this? If not, make one
type User = {
	username: string;
	password: string;
};

const emptyUser: User = {
	username: "",
	password: ""
};

// this should match the shape of the response sent by the backend - @todo: find some way to unify this, or at least put all these together in a folder somewhere
type UserResponse = {
	username: string;
	created_at: string;
};

function useLogin() {
	const [user, setUser] = useState<User>(emptyUser);
	const { login, user: currentUser, logout } = useAuth();
	const navigate = useNavigate();

	function updateUser(
		e: React.ChangeEvent<HTMLInputElement> /* @todo: change event type? */
	): void {
		const { name, value } = e.target;
		setUser(user => ({ ...user, [name]: value }));
	}

	function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		/*  @todo: create validation function, that sets a message, notification or something,
            for example when password is empty, or username doesn't exist, etc.  */

		// validate(name, value)
		updateUser(e);
	}

	async function onSubmit(e: any /* @todo: add type */) {
		e.preventDefault();

		try {
			/* @note have to destructure `user` so that passport.authenticate() on the backend works properly. */
			// @see  https://github.com/Seerden/trade/issues/12
			const { data } = await axios.post<any, { data: UserResponse }>("/auth/login", {
				...user
			});
			const { username, created_at } = data;
			/**
			 * @todo:
			 * [x] set user state
			 * [ ] flash a message
			 * [ ] after small timeout, redirect somewhere
			 */
			login({ username });

			navigate(`/u/${username}`);
		} catch (error) {
			// @todo: properly handle the error - sentry?
			console.log(error);
		}
	}

	async function handleLogout(e: any) {
		e.preventDefault();

		try {
			const { data } = await axios.post("/auth/logout");
			if (data.success === true) {
				logout();
				navigate("/");
			}
		} catch (e) {
			// TODO: properly handle errors
			console.error(e);
		}
	}

	return {
		onChange,
		onSubmit,
		handleLogout
	} as const;
}

export default useLogin;
