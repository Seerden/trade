import { StyledInput as SharedStyledInput } from "components/Authentication/Login/Login.style";
import styled, { css } from "styled-components";

// <!-- StyledInput -->

export const StyledInput = styled(SharedStyledInput)<{ $size?: string }>`
	height: 2rem;

	// in this specific case, the following is just for the 'time' field,
	// whose content needs slightly more space than 5rem
	width: 5.5rem;

	${p =>
		p.$size === "small" &&
		css`
			width: 5rem;
		`}

	${p =>
		p.$size === "large" &&
		css`
			width: 10rem;
		`}

	&::placeholder {
		font-size: 0.82rem;
	}
`;

const sideToColor = {
	buy: "seagreen",
	sell: "orange"
};

// <!-- TradeActionButton -->

// @todo: use TradeAction type for buy/sell
export const StyledButton = styled.button<{ side: "buy" | "sell"; active?: boolean }>`
	// @todo: use theme values
	width: 2.5rem;
	padding: 0.5rem 1rem;

	font-size: var(--text-medium);

	border: 2px solid transparent;
	border-color: ${p => p.active && sideToColor[p.side]};

	background-color: transparent;

	color: ${p => sideToColor[p.side]};

	transition: all 55ms linear;

	height: 2rem;
	display: inline-flex;
	justify-content: center;
	align-items: center;
`;
