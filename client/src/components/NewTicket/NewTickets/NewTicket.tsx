import { useCallback, useMemo, useState } from "react";
import { BsX } from "react-icons/bs";
import { TradeAction } from "types/tickets";
import { StyledButton, StyledNewTicket } from "./NewTicket.style";
import Input from "./sub/Input";
import TradeActionButton from "./sub/TradeActionButton";
import { useNewTickets } from "./useNewTickets";

const actions = "buy sell".split(" ");

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
	const hasFilledInFields = useMemo(() => {
		return "price ticker quantity action"
			.split(" ")
			.some(
				(field) =>
					field in ticket &&
					ticket[field] !== undefined &&
					ticket[field]?.length
			);
	}, [ticket]);

	const actionButtons = useMemo(
		() =>
			actions.map((action: TradeAction) => {
				const active = ticket?.action === action;

				return (
					<TradeActionButton
						required={hasFilledInFields && !ticket.action}
						index={ticketIndex}
						key={action}
						action={action}
						active={active}
						onClick={() => {
							setAction(ticketIndex, action);
						}}
					/>
				);
			}),
		[ticket]
	);

	/**
	 * If hasFilledInFields, return `placeholder`, else return null.
	 * To be used to only display placeholders for certain inputs if hasFilledInFields.
	 *
	 * @todo: refine condition hasFilledInFields to something slightly different:
	 * - also want to display placeholder if user is focused or hovering the
	 *   ticket, or if they have selected a tradeAction, or changed the `date` or
	 *   `time` field.
	 */
	const getPlaceholder = useCallback(
		(placeholder: string) => {
			return hasFilledInFields ? placeholder : null;
		},
		[hasFilledInFields]
	);

	const [shouldShowDelete, setShouldShowDelete] = useState<boolean>(false);

	// TODO: combine showDelete and hideDelete into one function
	const showDelete = useCallback(() => {
		setShouldShowDelete(true);
	}, [shouldShowDelete, setShouldShowDelete]);

	const hideDelete = useCallback(() => {
		setShouldShowDelete(false);
	}, [shouldShowDelete, setShouldShowDelete]);

	return (
		<StyledNewTicket
			empty={!hasFilledInFields}
			onMouseEnter={showDelete}
			onMouseLeave={hideDelete}
		>
			{/* action buttons */}
			{/* TODO: I don't like that these are just in a span. Has to be a more semantic way to do this. */}
			<span>{actionButtons}</span>

			{/* ticker field */}
			<Input
				required={hasFilledInFields}
				$size="small"
				title="Ticker"
				name="ticker"
				placeholder={getPlaceholder("ticker")}
				// TODO: don't repeat e => setField(e, ticketIndex) every time, write
				// a curried function instead
				onChange={(e) => setField(e, ticketIndex)}
			/>

			{/* price field */}
			<Input
				required={hasFilledInFields}
				$size="small"
				title="Price per share"
				name="price"
				type="number"
				min={0}
				step="any"
				placeholder={getPlaceholder("price")}
				onChange={(e) => {
					setField(e, ticketIndex);
				}}
			/>

			{/* quantity field */}
			<Input
				required={hasFilledInFields}
				$size="small"
				title="Share quantity"
				name="quantity"
				type="number"
				min={0}
				step="any"
				placeholder={getPlaceholder("quantity")}
				onChange={(e) => setField(e, ticketIndex)}
			/>

			{/* date field */}
			<Input
				required={hasFilledInFields}
				$size="large"
				title="Date"
				name="date"
				type="date"
				onChange={(e) => setField(e, ticketIndex)}
				defaultValue={ticket.date}
			/>

			{/* time field */}
			<Input
				required={hasFilledInFields}
				title="Time of day (market time)"
				name="time"
				type="time"
				onChange={(e) => setField(e, ticketIndex)}
				defaultValue="09:30"
			/>

			{shouldShowDelete && (
				<StyledButton
					type="button"
					onClick={() => {
						deleteTicket(ticketIndex);
					}}
				>
					<BsX type="button" overflow={"visible"} />
				</StyledButton>
			)}
		</StyledNewTicket>
	);
};

export default NewTicket;
