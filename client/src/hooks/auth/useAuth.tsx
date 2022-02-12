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
        setUser(user);
    }

    // @todo: could also use resetRecoilState
    function logout(): void {
        setUser({
            username: "",
        });
    }

    return {
        user,
        login,
        logout,
        isLoggedIn,
    } as const;
}
