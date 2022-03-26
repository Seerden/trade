import { HTMLProps } from "react";
import { StyledButton } from "./TradeActionButton.style";

interface Props extends Partial<HTMLProps<HTMLButtonElement>> {
	// @todo: use TradeAction type or something
	side: "buy" | "sell";
}

export default function TradeActionButton({ side, ...buttonProps }: Props) {
	return <StyledButton side={side}>{side}</StyledButton>;
}
