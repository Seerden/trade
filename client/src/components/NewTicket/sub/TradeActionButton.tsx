import { ButtonHTMLAttributes } from "react";
import { StyledButton } from "./TradeActionButton.style";

interface Props extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
	// @todo: use TradeAction type or something
	side: "buy" | "sell";
	active?: boolean;
}

export default function TradeActionButton({ side, active, ...buttonProps }: Props) {
	return (
		<StyledButton side={side} active={active} {...buttonProps}>
			{side}
		</StyledButton>
	);
}
