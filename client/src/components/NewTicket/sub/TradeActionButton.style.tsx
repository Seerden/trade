import styled from "styled-components";

const sideToColor = {
	buy: "seagreen",
	sell: "orange"
};

// @todo: use TradeAction type for buy/sell
export const StyledButton = styled.button<{ side: "buy" | "sell" }>`
	// @todo: use theme values
	padding: 0.5rem 1rem;

	border: 2px solid transparent;
	border-color: ${p => sideToColor[p.side]};

	background-color: transparent;

	color: ${p => sideToColor[p.side]};
`;
