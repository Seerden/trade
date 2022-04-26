import styled, { css } from "styled-components";

export const NewTicketsButtonBar = styled.span`
	display: flex;
	justify-content: space-between;

	span {
		display: inline-flex;
		align-items: center;
		gap: ${({ theme }) => theme.padding.tiny};
	}
`;

const roundButtonSize = "25px;";

export const NewTicketsButton = styled.input<{ round?: boolean }>`
	height: ${roundButtonSize};
	${(p) =>
		p.round
			? css`
					width: ${roundButtonSize};
					height: ${roundButtonSize};
					border-radius: 50%;
					justify-content: center;
					text-align: center;
					display: inline-block;
					vertical-align: middle;
			  `
			: css`
					width: max-content;
					padding: ${(p) => p.theme.padding.wide.button.tiny};
			  `}

	display: flex;
	background-color: transparent;
	font-size: ${(p) => p.theme.font.tiny};

	border: 2px solid ${(p) => p.theme.colors.grey.light};

	transition: all 75ms ease-out;

	&:not(:disabled) {
		&:hover {
			box-shadow: 0 4px 0 -2px lightgrey;
			transform: translateY(-2px);
		}
	}
`;

export const NewTicketsButtons = styled.div`
	display: block;
	position: sticky;
	z-index: 2;
	top: 1rem;

	margin-bottom: ${(p) => p.theme.padding.small};
	gap: ${({ theme }) => theme.padding.tiny};
`;

export const NewTickets = styled.form`
	display: block;
	margin: 0 auto;
	max-width: max-content;
	width: max-content;

	padding: ${(p) => p.theme.padding.wide.section};
	border-radius: 5px;
	box-shadow: 0 0 0.2rem 0 #ccc;
`;

export const NewTicketsTitle = styled.h1`
	display: block;
	width: max-content;
	position: relative;
	z-index: 1;
	font-size: ${(p) => p.theme.font.large};
	font-weight: 600;
	user-select: none;
	margin-bottom: ${(p) => p.theme.padding.tiny};

	// Create an offset border using a box-shadow.
	&::after {
		content: "";
		display: block;
		min-height: 15px;
		margin-top: -10px;
		margin-left: -15px;
		box-shadow: -3px 3px 0 0 #eee;
		width: 200%;
		position: static;
		z-index: 0;
		top: 1rem;
		left: 1rem;
		background-color: #fefefe;
	}
`;

export const NewTicketsSubtitle = styled.h3`
	font-size: ${(p) => p.theme.font.medium};
	word-wrap: break-word;
	color: #aaa;
	font-weight: 350;

	margin: 0 auto;

	// TODO: make this value responsive.
	max-width: 720px;
	margin-bottom: ${(p) => p.theme.padding.tiny};
`;

export const Tickets = styled.section`
	margin: ${(p) => p.theme.padding.large} 0;
`;
