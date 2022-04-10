import useAxios from "helpers/api/axios-instance";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export default function useReconcileSession() {
	const { user, login, logout } = useAuth();
	const axiosInstance = useAxios();

	// Get current user session from backend. If user from client isn't equal to
	// user from backend, then log in with user from backend, or log out,
	// depending on the backend response.
	useEffect(() => {
		(async function () {
			try {
				const { data } = await axiosInstance.get<{ username?: string }>(
					"/auth/me"
				);

				// If user matches, don't do anything
				// If no user returned, logout()
				if (!data?.username) {
					logout();
				}
				// If session user != client user, log in with session user.
				if (data?.username !== user.username || !user?.username) {
					login({ username: data.username });
				}
			} catch (error) {
				// No user in session (response 401), or something else went wrong.
				// Either way, log out.
				logout();
			}
		})();
	}, []);
}
