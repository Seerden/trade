import { SharedBaseInput } from "style/shared/input.style";
import styled, { css } from "styled-components";
import { TradeAction } from "types/tickets";

export const StyledInput = styled(SharedBaseInput)<{ $size?: string }>`
	height: 2rem;

	// This default width is currently only used for the name="time" input
	// component, it needs slightly more width in locales where AM/PM are
	// specified instead of using 24-hour times.
	--width: 6.5rem;
	min-width: var(--width);
	width: var(--width);

	${(p) =>
		p.$size === "small" &&
		css`
			min-width: 5rem;
			width: 5rem;
		`}

	${(p) =>
		p.$size === "large" &&
		css`
			--large-input-width: 9rem;
			min-width: var(--large-input-width);
			width: var(--large-input-width);
		`}

	&::placeholder {
		font-size: 0.82rem;
	}

	&:required {
		&:placeholder-shown {
			border-bottom: 2px solid orange;
		}
	}

	transition: border 100ms ease-out;
`;

const actionToColor = {
	buy: "seagreen",
	sell: "orange",
};

export const StyledTradeActionButton = styled.span`
	width: max-content;
	position: relative;
`;

export const StyledTradeActionInput = styled.input`
	display: inline-block;
	position: absolute;
	z-index: 0;
	left: calc(100% - 2rem);
	opacity: 0;
	width: 100%;
	height: 100%;
`;

export const StyledTradeActionLabel = styled.label<{
	action: TradeAction;
	active?: boolean;
	required?: boolean;
}>`
	display: inline-block;

	// TODO: use theme values
	width: 2.5rem;
	padding: 0.5rem 1rem;

	font-size: var(--text-medium);

	border: 2px solid transparent;
	border-color: ${(p) => p.active && actionToColor[p.action]};

	background-color: transparent;

	color: ${(p) => actionToColor[p.action]};

	transition: all 35ms fade-out;

	height: 2rem;
	display: inline-flex;
	justify-content: center;
	align-items: center;

	${(p) =>
		p.required &&
		css`
			border-bottom: 2px solid orange;
		`}
`;
