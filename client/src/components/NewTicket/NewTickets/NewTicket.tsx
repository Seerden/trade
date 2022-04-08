import { useCallback, useMemo } from "react";
import { BsX } from "react-icons/bs";
import { StyledButton, StyledNewTicket } from "./NewTicket.style";
import Input from "./sub/Input";
import TradeActionButton from "./sub/TradeActionButton";
import { useNewTickets } from "./useNewTickets";

const actions = "buy sell".split(" ");

export type RawNewTicket = {
	action: "buy" | "sell";
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
			actions.map((action: "buy" | "sell") => {
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

	const priceStep = useMemo(() => {
		const price = +ticket?.price;

		if (price >= 1000) {
			return 1;
		}
		if (price >= 1) {
			return 0.01;
		}
		return 1e-4;
	}, [ticket?.price]);

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

	const quantityStep = useMemo(() => {
		const quantity = +ticket?.quantity;

		if (quantity >= 1e6) {
			return 1e4;
		}
		if (quantity >= 1e5) {
			return 1000;
		}
		if (quantity >= 1e4) {
			return 500;
		}
		if (quantity >= 1e3) {
			return 100;
		}
		if (quantity >= 100) {
			return 10;
		}
		return 1;
	}, [ticket?.quantity]);

	return (
		<StyledNewTicket empty={!hasFilledInFields}>
			{/* action buttons */}
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
				step={priceStep}
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
				step={quantityStep}
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

			<StyledButton
				type="button"
				onClick={() => {
					deleteTicket(ticketIndex);
				}}
			>
				<BsX type="button" />
			</StyledButton>
		</StyledNewTicket>
	);
};

export default NewTicket;
