import { ButtonHTMLAttributes } from "react";
import { TradeAction } from "types/tickets";
import {
	StyledTradeActionButton,
	StyledTradeActionInput,
	StyledTradeActionLabel,
} from "./sub.style";

interface Props extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
	action: TradeAction;
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
		<StyledTradeActionButton>
			<StyledTradeActionLabel
				action={action}
				active={active}
				required={required}
			>
				<span>{action}</span>
				<StyledTradeActionInput
					required={required}
					type="radio"
					name={name}
					value={action}
					{...buttonProps}
				/>
			</StyledTradeActionLabel>
		</StyledTradeActionButton>
	);
}
