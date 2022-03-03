import { useAuth } from "hooks/auth/useAuth";
import { Link } from "react-router-dom";
import {
    StyledButton,
    StyledButtons,
    StyledFields,
    StyledForm,
    StyledInput,
    StyledLabel,
    StyledTitle
} from "./Login.style";
import useLogin from "./useLogin";

function Login() {
    const { onChange, onSubmit } = useLogin();
    const { isLoggedIn, user, logout } = useAuth();

    if (isLoggedIn) {
        return (
            // using styled form just so that style is consistent between the
            // two render cases, but this should really be just another element type
            <StyledForm>
                <p>You're already logged in.</p>
                <p>
                    Go to <Link to={`/u/${user.username}`}>your profile</Link>
                </p>
                <p>
                    <StyledButton
                        type="button"
                        onClick={e => {
                            e.preventDefault();
                            logout();
                        }}
                        value="Log out"
                    />
                </p>
            </StyledForm>
        );
    }

    return (
        <StyledForm onSubmit={onSubmit}>
            <StyledTitle>Log in</StyledTitle>
            <StyledFields>
                <div>
                    {/* username field */}
                    <StyledLabel htmlFor="username">Username</StyledLabel>
                    <StyledInput type="text" name="username" onChange={onChange} />
                </div>
                <div>
                    {/* password field */}
                    <StyledLabel htmlFor="password">Password</StyledLabel>
                    <StyledInput type="password" name="password" onChange={onChange} />
                </div>
                <StyledButtons>
                    <StyledButton type="submit" value="Log in" />
                    <StyledButton type="button" value="Sign up" isRegisterButton />
                </StyledButtons>
            </StyledFields>
        </StyledForm>
    );
}

export default Login;
