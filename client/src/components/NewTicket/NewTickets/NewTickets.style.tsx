import styled, { css } from "styled-components";

/**
 * TODO: unify with theme values
 */

export const StyledButtonWrapper = styled.span`
	display: flex;
	justify-content: space-between;

	span {
		display: inline-flex;
		align-items: center;
		gap: ${({ theme }) => theme.padding.tiny};
	}
`;

export const StyledButton = styled.input<{ round?: boolean }>`
	${(p) =>
		p.round
			? css`
					width: 25px;
					height: 25px;
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

	display: inline-flex;
	background-color: transparent;
	font-size: ${(p) => p.theme.font.tiny};

	border: 2px solid ${(p) => p.theme.colors.grey.light};

	transition: all 75ms ease-out;

	&:hover {
		box-shadow: 0 4px 0 -2px lightgrey;
		transform: translateY(-2px);
	}
`;

export const StyledButtons = styled.span`
	margin-bottom: ${(p) => p.theme.padding.small};
	display: block;
	position: sticky;
	z-index: 2;
	top: 1rem;
	flex-direction: row;

	gap: ${({ theme }) => theme.padding.tiny};
`;

export const StyledNewTickets = styled.form`
	display: block;
	margin: 0 auto;
	max-width: max-content;
	width: max-content;

	padding: ${(p) => p.theme.padding.wide.section};
	border-radius: 5px;
	box-shadow: 0 0 0.2rem 0 #ccc;
`;

export const StyledTitle = styled.h1`
	display: block;
	width: max-content;
	position: relative;
	z-index: 1;
	font-size: ${(p) => p.theme.font.large};
	font-weight: 600;
	user-select: none;
	margin-bottom: ${(p) => p.theme.padding.tiny};

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

export const StyledSubtitle = styled.h3`
	font-size: ${(p) => p.theme.font.medium};
	word-wrap: break-word;
	color: #aaa;
	font-weight: 350;

	margin: 0 auto;

	max-width: 720px;
	margin-bottom: ${(p) => p.theme.padding.tiny};
`;

export const StyledTickets = styled.section`
	margin: ${(p) => p.theme.padding.large} 0;
`;
