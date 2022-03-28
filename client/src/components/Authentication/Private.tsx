import { useAuth } from "hooks/auth/useAuth";
import Login from "./Login/Login";

type Props = {
	component: JSX.Element;
};

export default function Private({ component }: Props) {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		return <Login />;
	}

	return component;
}
