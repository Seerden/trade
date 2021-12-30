import cs from "./Login.module.scss";

function Login() {
    return (
        <form className={cs.Form}>
            <h2 className={cs.Title}>Log in</h2>
            <div className={cs.Fields}>
                <div className={cs.Field}>
                    <label htmlFor="username" className={cs.Label}>
                        Username
                    </label>
                    <input type="text" name="username" className={cs.Input} />
                </div>
                <div className={cs.Field}>
                    <label htmlFor="password" className={cs.Label}>
                        Password
                    </label>
                    <input type="password" name="password" className={cs.Input} />
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
