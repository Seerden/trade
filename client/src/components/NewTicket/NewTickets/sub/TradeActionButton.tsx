import { ButtonHTMLAttributes } from "react";
import { StyledButton } from "./sub.style";

interface Props extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
	// @todo: use TradeAction type or something
	action: "buy" | "sell";
	active?: boolean;
}

export default function TradeActionButton({ action, active, ...buttonProps }: Props) {
	return (
		<StyledButton type="button" action={action} active={active} {...buttonProps}>
			{action}
		</StyledButton>
	);
}
