import { ButtonHTMLAttributes } from "react";
import { StyledTradeActionButton } from "./sub.style";

interface Props extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
	// @todo: use TradeAction type or something
	action: "buy" | "sell";
	index: number;
	active?: boolean;
	required: boolean;
}

export default function TradeActionButton({
	action,
	active,
	index,
	required,
	...buttonProps
}: Props) {
	const name = `action-${index}`;
	return (
		<StyledTradeActionButton
			action={action}
			active={active}
			required={required}
		>
			<label>
				<span>{action}</span>
				<input
					required={required}
					type="radio"
					name={name}
					value={action}
					{...buttonProps}
				/>
			</label>
		</StyledTradeActionButton>
	);
}
