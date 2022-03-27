import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Input from "./sub/Input";
import TradeActionButton from "./sub/TradeActionButton";
/**
   table of new tickets, acts like one large form, but should feel like a google
   sheet
   

   fields:
      - action
         - buy/sell buttons
      - ticker
         - text input
      - quantity
         - number input (integers)
      - datetime;
         - date
            - date input
         - market time
            - time input
      - price
         - number input, 2-4 decimals


*/

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

// for now, pretend we're just creating one ticket, and then expand to multiple
// tickets once the single ticket is functional
export default function NewTickets() {
	const today = dayjs(new Date()).format("YYYY-MM-DD");
	const [ticket, setTicket] = useState({
		side: "buy"
	} as Partial<NewTicket>);

	// @todo: dev - log changes
	useEffect(() => {
		if (ticket) {
			console.log(ticket);
		}
	}, [ticket]);

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

	// @todo: below currently represents 1 ticket. Eventually we'll have a row
	// per ticket
	return (
		<>
			<Header />
			<StyledRow>
				{/* labels/header columns first */}

				{/* fields inputs/buttons in order */}

				{/* action buttons */}
				{actionButtons}

				{/* ticker field */}
				<Input $size="small" name="ticker" placeholder="ticker" onChange={setField} />

				{/* price field */}
				<Input
					$size="small"
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
					name="date"
					type="date"
					onChange={setField}
					defaultValue={today}
				/>

				{/* time field */}
				<Input name="time" type="time" onChange={setField} defaultValue="09:30" />
			</StyledRow>
		</>
	);
}

function Header() {
	const columns = "action ticker price quantity date time".split(" ");

	return (
		<StyledHeader>
			{columns.map((col, index) => (
				<div key={index}>{col}</div>
			))}
		</StyledHeader>
	);
}

const StyledHeader = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 5rem) 10rem 5.5rem;
	gap: 0;

	div {
		text-align: center;
		font-size: 0.82rem;
		border-bottom: 2px solid #eee;
		padding-bottom: 0.25rem;
		margin-bottom: 0.3rem;
	}
`;

const StyledRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 2.5rem;
`;
