import { useAuth } from "hooks/auth/useAuth";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Navigation() {
	const { user, isLoggedIn } = useAuth();

	return (
		<StyledNav>
			{isLoggedIn ? (
				<div>{user}</div>
			) : (
				<div>
					<Link to="/login">Log in</Link>
				</div>
			)}
		</StyledNav>
	);
}

const StyledNav = styled.nav`
	border-bottom: 2px solid #eee;
	padding-bottom: 0.8rem;
	margin-bottom: 1rem;
`;
