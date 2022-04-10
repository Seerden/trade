import styled, { css } from "styled-components";

// TODO: all this styling needs to be unified with theme styles
export const StyledNewTicket = styled.fieldset<{ empty?: boolean }>`
	${(p) =>
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

	position: relative;
	// TODO: the +2.5rem is to prevent layout shift when sliding in the delete
	// button (delete button width is 2.5rem)
	min-width: calc(100% + 2.5rem);

	transition: filter 75ms linear, opacity 90ms linear;
`;

export const StyledButton = styled.button`
	display: inline-flex;

	align-items: center;
	justify-content: center;
	background-color: transparent;

	position: absolute;
	right: 0;

	width: 2.5rem;
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

	animation: 100ms ease-out slide-in;

	@keyframes slide-in {
		0% {
			transform: translateX(-10px);
		}

		100% {
			transform: translateX(0px);
		}
	}
`;
