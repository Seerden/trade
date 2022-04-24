import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { BsX } from "react-icons/bs";
import { TradeAction } from "types/tickets";
import {
	StyledNewTicket,
	StyledNewTicketDeleteButton,
} from "./NewTicket.style";
import Input from "./sub/Input";
import TradeActionButton from "./sub/TradeActionButton";
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
	 * Curried function that calls setField with `ticketIndex`, so we can do
	 * onChange={onChange} throughout this component's JSX.
	 */
	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			return setField(e, ticketIndex);
		},
		[setField, ticketIndex]
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

	const sharedInputProps = {
		required: hasFilledInFields,
		onChange,
	};

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
				onChange={onChange}
			/>

			{/* price field */}
			<Input
				{...sharedInputProps}
				$size="small"
				title="Price per share"
				name="price"
				type="number"
				min={0}
				step="any"
				placeholder={getPlaceholder("price")}
			/>

			{/* quantity field */}
			<Input
				{...sharedInputProps}
				$size="small"
				title="Share quantity"
				name="quantity"
				type="number"
				min={0}
				step="any"
				placeholder={getPlaceholder("quantity")}
			/>

			{/* date field */}
			<Input
				required={hasFilledInFields}
				$size="large"
				title="Date"
				name="date"
				type="date"
				defaultValue={ticket.date}
			/>

			{/* time field */}
			<Input
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
					<BsX type="button" overflow={"visible"} />
				</StyledNewTicketDeleteButton>
			)}
		</StyledNewTicket>
	);
};

export default NewTicket;
