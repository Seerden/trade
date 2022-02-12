import cs from "./Login.module.scss";
import useLogin from "./useLogin";

function Login() {
    const { onChange, onSubmit } = useLogin();

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
