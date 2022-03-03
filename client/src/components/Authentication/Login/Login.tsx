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

    return (
        <StyledForm onSubmit={onSubmit}>
            <StyledTitle>Log in</StyledTitle>
            <StyledFields>
                {/* username field */}
                <div>
                    <StyledLabel htmlFor="username">Username</StyledLabel>
                    <StyledInput type="text" name="username" onChange={onChange} />
                </div>
                {/* password field */}
                <div>
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
