/**
 * @todo: this file still uses a bunch of --vars, we want to fully convert these
 * to shared styles eventually
 *
 * @todo: want to match the width of StyledButtons with the width of the inputs
 * for a more consistent UI feel
 */

import { SharedBaseInput } from "style/shared/input.style";
import styled, { css } from "styled-components";

export const StyledForm = styled.form`
	width: max-content;
	padding: ${(p) => p.theme.padding.wide.section};
	margin: ${(p) => p.theme.padding.medium};
	margin: ${(p) => p.theme.padding.medium} auto;

	border: 1px solid var(--main);
	box-shadow: 0 0 0.5em 0 var(--main);
`;

export const StyledFields = styled.div`
	display: flex;
	flex-flow: column wrap;
	gap: ${(p) => p.theme.padding.tiny};
	justify-content: center;
`;

export const StyledLabel = styled.label`
	display: flex;
	font-size: var(--text-small);
	padding-left: ${(p) => p.theme.padding.tiniest};
	margin-bottom: ${(p) => p.theme.padding.tinier};
	user-select: none;
`;

export const StyledTitle = styled.h2`
	font-size: 1.5em;
	margin-bottom: ${(p) => p.theme.padding.tiny};
	user-select: none;
`;

export const StyledButtons = styled.div`
	display: flex;
	justify-content: space-between;
	gap: ${(p) => p.theme.padding.tiny};
`;

export const StyledInput = styled(SharedBaseInput)``;

export const StyledButton = styled.input<{ isRegisterButton?: boolean }>`
	padding: ${(p) => p.theme.padding.wide.button.tiny};
	font-size: var(--text-small);
	outline: 1px solid transparent;

	transition: all 75ms ease-out;

	&:hover,
	&:focus,
	&:active {
		outline: 1px solid var(--secondary);
	}

	${(p) =>
		p.isRegisterButton &&
		css`
			background-color: var(--light);
			color: var(--dark-tint);
		`}
`;
