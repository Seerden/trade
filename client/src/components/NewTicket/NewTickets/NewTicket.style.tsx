import styled, { css } from "styled-components";

export const StyledNewTicket = styled.fieldset<{ empty?: boolean }>`
	${p =>
		p.empty &&
		css`
			transform: translateZ(0);
			&:not(:hover) {
				opacity: 0.45;
				filter: grayscale(1);
			}
		`}
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 2.5rem;
	gap: 0.45rem;
	font-size: 0.88rem;

	transition: filter 75ms linear, opacity 90ms linear;
`;

export const StyledButton = styled.button`
	display: inline-flex;

	align-items: center;
	justify-content: center;
	background-color: transparent;

	width: 25px;
	min-height: 25px;
	height: 25px;
	line-height: 100%;

	border-radius: 50%;

	transition: color 35ms ease-in, transform 50ms ease-out;

	&:hover,
	&:active {
		color: red;
		font-weight: 500;
		transform: scale(1.4);
	}
`;
