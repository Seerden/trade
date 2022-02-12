import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import cs from "./Login.module.scss";

// @todo: is there already a type for this? If not, make one
type User = {
    username: string;
    password: string;
};

const emptyUser: User = {
    username: "",
    password: "",
};

function Login() {
    // functionality - @todo: extract to hook later
    const [user, setUser] = useState<User>(emptyUser);
    const navigate = useNavigate();

    function updateUser(
        e: React.ChangeEvent<HTMLInputElement> /* @todo: change event type? */
    ): void {
        const { name, value } = e.target;
        setUser((user) => ({ ...user, [name]: value }));
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;
        /*  @todo: create validation function, that sets a message, notification or something,
            for example when password is empty, or username doesn't exist, etc.  */

        // validate(name, value)
        updateUser(e);
    }

    // this should match the shape of the response sent by the backend - @todo: find some way to unify this, or at least put all these together in a folder somewhere
    type UserResponse = {
        username: string;
        created_at: string;
    };

    async function onSubmit(e: any /* @todo: add type */) {
        e.preventDefault();

        try {
            /* @note have to destructure `user` so that passport.authenticate() on the backend works properly. */
            // @see  https://github.com/Seerden/trade/issues/12
            const { data } = await axios.post<any, { data: UserResponse }>(
                "/auth/login",
                { ...user }
            );
            const { username, created_at } = data;
            /*
                - set user state
                - flash a message
                - after small timeout, redirect somewhere
            */

            navigate(`/u/${username}`);
        } catch (error) {
            // @todo: properly handle the error - sentry?
            console.log(error);
        }
    }

    return (
        <form className={cs.Form} onSubmit={onSubmit}>
            <h2 className={cs.Title}>Log in</h2>
            <div className={cs.Fields}>
                <div className={cs.Field}>
                    <label htmlFor="username" className={cs.Label}>
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        className={cs.Input}
                        onChange={onChange}
                    />
                </div>
                <div className={cs.Field}>
                    <label htmlFor="password" className={cs.Label}>
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        className={cs.Input}
                        onChange={onChange}
                    />
                </div>
                <div className={cs.Field}>
                    <div className={cs.Buttons}>
                        <input type="submit" value="Log in" className={cs.Button} />
                        <input type="button" value="Sign up" className={cs.Register} />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Login;
