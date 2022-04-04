import useAxios from "helpers/api/axios-instance";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export default function useReconcileSession() {
	const { user, login, logout } = useAuth();
	const axiosInstance = useAxios();

	// Get current user session from backend. If user doesn't match with what
	// client believes it should be, log in or out, depending on response.
	useEffect(() => {
		(async function() {
			try {
				const { data } = await axiosInstance.get<{ username?: string }>("/auth/me");

				// If user matches, don't do anything
				// If no user returned, logout()
				if (!data?.username) {
					logout();
				}
				// If user in session doesn't match user on client, log in with user
				// from session.
				if (data?.username !== user.username || !user?.username) {
					login({ username: data.username });
				}
			} catch (error) {
				// Either user isn't logged in (response 401), or something else
				// went wrong. Either way, we should log out.
				logout();
			}
		})();
	}, []);
}
