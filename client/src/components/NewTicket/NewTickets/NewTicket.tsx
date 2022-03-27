import dayjs from "dayjs";
import { useMemo, useState } from "react";
import styled from "styled-components";
import Input from "./sub/Input";
import TradeActionButton from "./sub/TradeActionButton";

const sides = "buy sell".split(" ");

type NewTicket = {
	// @todo: use type
	side: "buy" | "sell";
	ticker: string;
	quantity: number;
	date: string;
	time: string;
	price: number;
};

const StyledRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 2.5rem;
`;

const today = dayjs(new Date()).format("YYYY-MM-DD");

export default function NewTicket() {
	const [ticket, setTicket] = useState({
		side: "buy",
		date: today,
		time: "09:30"
	} as Partial<NewTicket>);

	const actionButtons = useMemo(
		() =>
			sides.map((side: "buy" | "sell") => {
				const active = ticket?.side === side;

				return (
					<TradeActionButton
						key={side}
						side={side}
						active={active}
						onClick={() => {
							setSide(side);
						}}
					/>
				);
			}),
		[ticket]
	);

	/**
	 * Set ticket.side to `side`
	 */
	const setSide = (side: NewTicket["side"]) => {
		setTicket(cur => ({ ...cur, side: side }));
	};

	const setField = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTicket(cur => ({ ...cur, [name]: value }));
	};

	const priceStep = useMemo(() => {
		const price = ticket?.price;

		if (price >= 1000) {
			return 1;
		}
		if (price >= 1) {
			return 0.01;
		}
		return 1e-4;
	}, [ticket?.price]);

	const quantityStep = useMemo(() => {
		const quantity = ticket?.quantity;

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
		<StyledRow>
			{/* action buttons */}
			{actionButtons}

			{/* ticker field */}
			<Input
				$size="small"
				title="Ticker"
				name="ticker"
				placeholder="ticker"
				onChange={setField}
			/>

			{/* price field */}
			<Input
				$size="small"
				title="Price per share"
				name="price"
				type="number"
				min={0}
				step={priceStep}
				placeholder="price"
				onChange={setField}
			/>

			{/* quantity field */}
			<Input
				$size="small"
				title="Share quantity"
				name="quantity"
				type="number"
				min={0}
				step={quantityStep}
				placeholder="quantity"
				onChange={setField}
			/>

			{/* date field */}
			<Input
				$size="large"
				title="Date"
				name="date"
				type="date"
				onChange={setField}
				defaultValue={today}
			/>

			{/* time field */}
			<Input
				title="Time of day (market time)"
				name="time"
				type="time"
				onChange={setField}
				defaultValue="09:30"
			/>
		</StyledRow>
	);
}
