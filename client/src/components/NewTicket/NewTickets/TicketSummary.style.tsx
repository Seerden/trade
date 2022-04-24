import styled from "styled-components";

/** TODO:
 * WIP component. This will be a shared component, everything in here will be a
 * theme value.
 */
export const StyledContainer = styled.section`
	position: fixed;
	z-index: 21;

	margin-top: 20vh;
	left: 50%;
	transform: translateX(-50%);
	padding: ${(p) => p.theme.padding.large};
	border: 4px solid #444;
	box-shadow: 0 0 1rem #111;
	border-radius: 5px;
	background: #efefef;
	width: max-content;
`;

// This is the background that serves to add visual focus to the modal.
export const StyledOverlay = styled.div`
	position: fixed;
	z-index: 20;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.68);
`;

const closeButtonSize = "30px";

// TODO: all of this styling is WIP and should at least be refactored to theme values
export const StyledModalCloseButton = styled.button`
	display: inline-flex;
	position: absolute;

	top: calc(-1 * ${closeButtonSize} / 2);
	right: calc(-1 * ${closeButtonSize} / 2);

	width: ${closeButtonSize};
	height: ${closeButtonSize};
	background-color: orangered;
	border: 2px solid orangered;

	border-radius: 50%;

	line-height: 20px;
	justify-content: center;
	align-items: center;
	text-align: center;

	transition: border-radius 75ms ease-in;

	&:hover {
		background-color: white;
		color: orangered;
		border-radius: 20%;

		svg {
			fill: orangered;
		}
	}
`;

// TODO: all of this styling is temporary
export const StyledSubmitButton = styled.button`
	margin-top: ${({ theme }) => theme.padding.small};
	padding: ${({ theme }) => theme.padding.wide.button.small};
	font-size: ${({ theme }) => theme.font.smaller};
	font-weight: 400;

	color: black;
	border: 2px solid black;
	border-radius: 3px;

	transition: all 50ms ease-in;

	&:hover {
		border-color: green;
		color: green;
	}
`;

export const StyledTicketSummary = styled.ul`
	width: max-content;
	gap: ${({ theme }) => theme.padding.tinier};
`;

export const StyledTicketRow = styled.li<{ saved?: boolean }>`
	border: 2px solid transparent;
	border-left-width: 4px;
	border-radius: 3px;
	padding: ${({ theme }) => theme.padding.wide.small};
	font-size: ${({ theme }) => theme.font.medium};

	border-left-color: ${(p) =>
		typeof p.saved === "boolean"
			? p.saved
				? "seagreen"
				: "orangered"
			: "transparent"};
`;
