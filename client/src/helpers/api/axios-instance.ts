import axios from "axios";
import { useAuth } from "hooks/auth/useAuth";

export default function useAxios() {
	const { user } = useAuth();
	const axiosInstance = axios.create({
		// TODO: dev-only baseURL - on prod we'd want to map this to the docker service
		// (0.0.0.0:5000??? http://server:5000??? maybe even just the domain, like trade.seerden.dev/)
		baseURL: "http://localhost:5000",
		withCredentials: true,
		// Add username query parameter to every request
		...(user?.username && { params: { username: user?.username } })
	});

	return axiosInstance;
}
