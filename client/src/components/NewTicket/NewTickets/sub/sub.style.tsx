import { StyledInput as SharedStyledInput } from "components/Authentication/Login/Login.style";
import styled, { css } from "styled-components";

// <!-- StyledInput -->

export const StyledInput = styled(SharedStyledInput)<{ $size?: string }>`
	height: 2rem;

	// in this specific case, the following is just for the 'time' field,
	// whose content needs slightly more space than 5rem
	min-width: 5.5rem;
	width: 5.5rem;

	${p =>
		p.$size === "small" &&
		css`
			min-width: 5rem;
			width: 5rem;
		`}

	${p =>
		p.$size === "large" &&
		css`
			min-width: 10rem;
			width: 10rem;
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
	sell: "orange"
};

// <!-- TradeActionButton -->

// @todo: use TradeAction type for buy/sell
export const StyledButton = styled.button<{ action: "buy" | "sell"; active?: boolean }>`
	// @todo: use theme values
	width: 2.5rem;
	padding: 0.5rem 1rem;

	font-size: var(--text-medium);

	border: 2px solid transparent;
	border-color: ${p => p.active && actionToColor[p.action]};

	background-color: transparent;

	color: ${p => actionToColor[p.action]};

	transition: all 35ms fade-out;

	height: 2rem;
	display: inline-flex;
	justify-content: center;
	align-items: center;
`;
