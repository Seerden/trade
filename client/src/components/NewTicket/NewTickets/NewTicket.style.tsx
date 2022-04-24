import styled, { css } from "styled-components";

const deleteButtonWidth = "2.5rem";

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
	gap: ${({ theme }) => theme.padding.tiny};
	font-size: ${(p) => p.theme.font.small};

	position: relative;

	// Include delete button's width in min-width so there's no layout shift when
	// the delete button slides in.
	min-width: calc(100% + ${deleteButtonWidth});

	transition: filter 75ms linear, opacity 90ms linear;
`;

const deleteButtonSize = "25px";

export const StyledNewTicketDeleteButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;

	position: absolute;
	right: 0;

	background-color: transparent;

	width: ${deleteButtonWidth};
	height: ${deleteButtonSize};
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
