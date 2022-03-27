import { Link } from "react-router-dom";
import {
	StyledButton,
	StyledButtons,
	StyledFields,
	StyledForm,
	StyledInput,
	StyledLabel,
	StyledTitle
} from "../Login/Login.style";

/**
 Checklist:
 - [ ] functionality
    create useRegister hook
    create API routes
- [ ] styling
    synchronize with Login styling
*/

export default function Register() {
	return (
		<StyledForm>
			<StyledTitle>Register</StyledTitle>
			<StyledFields>
				<div>
					{/* username field */}
					<StyledLabel htmlFor={"username"}>Username</StyledLabel>
					<StyledInput type="text" name="username" />
				</div>

				<div>
					{/* password field */}
					<StyledLabel htmlFor={"password"}>Password</StyledLabel>
					<StyledInput type="password" name="password" />
				</div>

				<div>
					{/* repeat password field */}
					<StyledLabel htmlFor={"repeatPassword"}>Repeat password</StyledLabel>
					<StyledInput type="password" name="repeatPassword" />
				</div>
				<StyledButtons>
					<StyledButton type="submit" value="Register" />
					{/* @todo: rename isRegisterButton to isFaded or something */}
					<Link to="/login">
						<StyledButton type="button" value="Sign in" isRegisterButton />
					</Link>
				</StyledButtons>
			</StyledFields>
		</StyledForm>
	);
}
