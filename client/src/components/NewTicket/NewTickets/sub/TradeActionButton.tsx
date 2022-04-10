import { ButtonHTMLAttributes } from "react";
import { TradeAction } from "types/tickets";
import { StyledTradeActionButton } from "./sub.style";

interface Props extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
	action: `${TradeAction}`;
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
