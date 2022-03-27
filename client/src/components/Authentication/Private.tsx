import { useAuth } from "hooks/auth/useAuth";
import Login from "./Login/Login";

export default function Private(Component: JSX.Element) {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		return <Login />;
	}

	return Component;
}
