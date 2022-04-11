import styled from "styled-components";

const StyledButton = styled.button`
	border: 2px solid black;

	padding: ${(p) => p.theme.padding.large};
`;

function Button() {
	return <StyledButton value="I'm a button, click me please" />;
}

export default {
	title: "Button",
	component: Button,
};

export const LargePadding = () => (
	<StyledButton>I'm a button, click me!</StyledButton>
);
