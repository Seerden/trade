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
		gap: 0.4rem;
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
					padding: 0.3rem 1.6rem;
			  `}
	display: inline-flex;
	background-color: transparent;
	font-size: 0.72rem;

	border: 2px solid ${(p) => p.theme.colors.grey.light};

	transition: all 75ms ease-out;
	&:hover {
		box-shadow: 0 4px 0 -2px lightgrey;
		transform: translateY(-2px);
	}
`;

export const StyledButtons = styled.span`
	margin-bottom: 0.8rem;
	display: block;
	position: sticky;
	z-index: 2;
	top: 1rem;
	flex-direction: row;

	gap: 0.4rem;
`;

export const StyledNewTickets = styled.form`
	display: block;
	margin: 0 auto;
	max-width: max-content;
	width: max-content;

	padding: 2rem 4rem;
	border-radius: 5px;
	box-shadow: 0 0 0.2rem 0 #ccc;
`;

export const StyledTitle = styled.h1`
	display: block;
	width: max-content;
	position: relative;
	z-index: 1;
	font-size: 1.4rem;
	font-weight: 600;
	user-select: none;
	margin-bottom: 0.5rem;

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
	font-size: 0.9rem;
	word-wrap: break-word;
	color: #aaa;
	font-weight: 350;

	margin: 0 auto;

	max-width: 720px;
	margin-bottom: 0.8rem;
`;

export const StyledTickets = styled.section`
	margin: 2.1rem 0;
`;
