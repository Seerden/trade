import axios from "axios";
import { useAuth } from "hooks/auth/useAuth";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";

type NewUser = {
	username: string;
	password: string;
	repeatPassword: string;
};

function validate(user: NewUser) {
	const { username, password, repeatPassword } = user;

	return username?.length && password?.length && password === repeatPassword;
}

export function useRegister() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [newUser, setNewUser] = useState<NewUser>({
		username: null,
		password: null,
		repeatPassword: null
	});

	// used to flash a message, e.g. 'Username already exists' or 'password
	// doesn't match repeatPassword'
	const [message, setMessage] = useState<string>(null);

	const isValidNewUser = useMemo(() => validate(newUser), [newUser]);

	const onSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (isValidNewUser) {
				try {
					const { data } = await axios.post("auth/register", { newUser });
					const { username } = data.newUser;
					login(username);
					navigate(`/u/${username}`);
				} catch (e) {
					if (axios.isAxiosError(e)) {
						return setMessage(e.message);
					}
					// TODO: log to Sentry or something
					console.error(e);
				}
			}
		},
		[newUser, isValidNewUser]
	);

	// onChange handler for username, password and repeatPassword inputs
	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setNewUser(current => ({ ...current, [name]: value }));
	}

	return {
		onChange,
		onSubmit,
		message
	} as const;
}
