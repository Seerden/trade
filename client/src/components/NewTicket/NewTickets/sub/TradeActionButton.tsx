import { ButtonHTMLAttributes } from "react";
import { StyledTradeActionButton } from "./sub.style";

interface Props extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
	// @todo: use TradeAction type or something
	action: "buy" | "sell";
	index: number;
	active?: boolean;
}

export default function TradeActionButton({
	action,
	active,
	index,
	...buttonProps
}: Props) {
	const name = `action-${index}`;
	return (
		<StyledTradeActionButton action={action} active={active}>
			<label>
				<span>{action}</span>
				<input type="radio" name={name} value={action} {...buttonProps} />
			</label>
		</StyledTradeActionButton>
	);
}
