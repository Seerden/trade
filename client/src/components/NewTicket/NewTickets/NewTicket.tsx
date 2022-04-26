import { ChangeEvent, useCallback, useMemo } from "react";
import { BsX } from "react-icons/bs";
import { TradeAction } from "types/tickets";
import {
	StyledNewTicket,
	StyledNewTicketDeleteButton,
} from "./NewTicket.style";
import NewTicketInput from "./sub/Input";
import TradeActionButton from "./sub/TradeActionButton";
import { useNewTicket } from "./useNewTicket";
import { useNewTickets } from "./useNewTickets";

const actions = "buy sell".split(" ") as TradeAction[];

export type RawNewTicket = {
	action: TradeAction;
	ticker: string;
	quantity: string;
	date: string;
	time: string;
	price: string;
};

type Props = {
	ticketIndex: number;
	ticket: Partial<RawNewTicket>;
	setAction: (ticketIndex: number, side: RawNewTicket["action"]) => void;
	setField: (
		e: React.ChangeEvent<HTMLInputElement>,
		ticketIndex: number
	) => void;
	deleteTicket: ReturnType<typeof useNewTickets>["deleteTicket"];
};

const NewTicket = ({
	ticketIndex,
	ticket,
	setAction,
	setField,
	deleteTicket,
}: Props) => {
	const {
		isRequired,
		getPlaceholder,
		eventHandlers,
		shouldShowDelete,
	} = useNewTicket(ticket);

	const actionButtons = useMemo(
		() =>
			actions.map((action: TradeAction) => (
				<TradeActionButton
					// The required prop is only used to display a border.
					// If there is already a ticket.action value, we don't want
					// the 'required'-specific border.
					required={isRequired && !ticket.action}
					index={ticketIndex}
					key={action}
					action={action}
					active={ticket?.action === action}
					onClick={() => {
						setAction(ticketIndex, action);
					}}
				/>
			)),
		[ticket, isRequired]
	);

	/**
	 * Curried function that returns setField with pre-set `ticketIndex`, so we
	 * can do onChange={onChange} throughout this component's JSX.
	 */
	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			return setField(e, ticketIndex);
		},
		[setField, ticketIndex]
	);

	const sharedInputProps = useMemo(
		() => ({
			required: isRequired,
			onChange,
		}),
		[isRequired, onChange]
	);

	return (
		<StyledNewTicket required={isRequired} {...eventHandlers}>
			{/* TODO: I don't like that these are just in a span. Has to be a more semantic way to do this. */}
			<span>{actionButtons}</span>

			<NewTicketInput
				{...sharedInputProps}
				$size="small"
				title="Ticker"
				name="ticker"
				defaultValue={ticket.ticker}
				placeholder={getPlaceholder("ticker")}
			/>

			<NewTicketInput
				{...sharedInputProps}
				$size="small"
				title="Price per share"
				name="price"
				defaultValue={ticket.price}
				type="number"
				min={0}
				step="any"
				placeholder={getPlaceholder("price")}
			/>

			<NewTicketInput
				{...sharedInputProps}
				$size="small"
				defaultValue={ticket.quantity}
				title="Share quantity"
				name="quantity"
				type="number"
				min={0}
				step="any"
				placeholder={getPlaceholder("quantity")}
			/>

			<NewTicketInput
				required={isRequired}
				$size="large"
				title="Date"
				name="date"
				type="date"
				defaultValue={ticket.date}
			/>

			<NewTicketInput
				required={isRequired}
				title="Time of day (market time)"
				name="time"
				type="time"
				defaultValue="09:30"
			/>

			{shouldShowDelete && (
				<StyledNewTicketDeleteButton
					type="button"
					onClick={() => {
						deleteTicket(ticketIndex);
					}}
				>
					<BsX />
				</StyledNewTicketDeleteButton>
			)}
		</StyledNewTicket>
	);
};

export default NewTicket;
