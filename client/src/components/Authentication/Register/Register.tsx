import { Link } from "react-router-dom";
import {
	StyledButton,
	StyledButtons,
	StyledFields,
	StyledForm,
	StyledInput,
	StyledLabel,
	StyledTitle,
} from "../Login/Login.style";
import { useRegister } from "./useRegister";

/**
 Checklist:
 - [x] functionality
    [x] create useRegister hook
    [x] create API routes
- [~] styling
    [~] synchronize with Login styling
      - TODO: width doesn't match exactly; consider fixing element widths
*/

export default function Register() {
	const { onChange, onSubmit } = useRegister();

	return (
		<StyledForm onSubmit={onSubmit}>
			<StyledTitle>Register</StyledTitle>
			<StyledFields>
				<div>
					{/* username field */}
					<StyledLabel htmlFor={"username"}>Username</StyledLabel>
					<StyledInput type="text" name="username" onChange={onChange} />
				</div>

				<div>
					{/* password field */}
					<StyledLabel htmlFor={"password"}>Password</StyledLabel>
					<StyledInput type="password" name="password" onChange={onChange} />
				</div>

				<div>
					{/* repeat password field */}
					<StyledLabel htmlFor={"repeatPassword"}>Repeat password</StyledLabel>
					<StyledInput
						type="password"
						name="repeatPassword"
						onChange={onChange}
					/>
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
