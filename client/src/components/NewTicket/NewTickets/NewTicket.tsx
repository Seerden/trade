import { useMemo } from "react";
import styled from "styled-components";
import Input from "./sub/Input";
import TradeActionButton from "./sub/TradeActionButton";

const actions = "buy sell".split(" ");

export type RawNewTicket = {
	action: "buy" | "sell";
	ticker: string;
	quantity: string;
	date: string;
	time: string;
	price: string;
};

const StyledNewTicket = styled.fieldset`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 2.5rem;
`;

type Props = {
	ticketIndex: number;
	ticket: Partial<RawNewTicket>;
	setAction: (ticketIndex: number, side: RawNewTicket["action"]) => void;
	setField: (e: React.ChangeEvent<HTMLInputElement>, ticketIndex: number) => void;
};

const NewTicket = ({ ticketIndex, ticket, setAction, setField }: Props) => {
	const actionButtons = useMemo(
		() =>
			actions.map((action: "buy" | "sell") => {
				const active = ticket?.action === action;

				return (
					<TradeActionButton
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

	const isRequiredField = useMemo(() => {
		return "price ticker quantity"
			.split(" ")
			.some(
				field => field in ticket && ticket[field] !== undefined && ticket[field]?.length
			);
	}, [ticket]);

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
		<StyledNewTicket>
			{/* action buttons */}
			{actionButtons}

			{/* ticker field */}
			<Input
				required={isRequiredField}
				$size="small"
				title="Ticker"
				name="ticker"
				placeholder="ticker"
				// TODO: don't repeat e => setField(e, ticketIndex) every time, write
				// a curried function instead
				onChange={e => setField(e, ticketIndex)}
			/>

			{/* price field */}
			<Input
				required={isRequiredField}
				$size="small"
				title="Price per share"
				name="price"
				type="number"
				min={0}
				step={priceStep}
				placeholder="price"
				onChange={e => {
					console.log("test");
					setField(e, ticketIndex);
				}}
			/>

			{/* quantity field */}
			<Input
				required={isRequiredField}
				$size="small"
				title="Share quantity"
				name="quantity"
				type="number"
				min={0}
				step={quantityStep}
				placeholder="quantity"
				onChange={e => setField(e, ticketIndex)}
			/>

			{/* date field */}
			<Input
				required={isRequiredField}
				$size="large"
				title="Date"
				name="date"
				type="date"
				onChange={e => setField(e, ticketIndex)}
				defaultValue={ticket.date}
			/>

			{/* time field */}
			<Input
				required={isRequiredField}
				title="Time of day (market time)"
				name="time"
				type="time"
				onChange={e => setField(e, ticketIndex)}
				defaultValue="09:30"
			/>
		</StyledNewTicket>
	);
};

export default NewTicket;
