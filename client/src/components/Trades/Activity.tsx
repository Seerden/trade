import { BuyTicket, SellTicket } from "../../types/tickets";
import { StyledCard, StyledRow } from "./Activity.style";
import { tickets } from "./mockTrades";

type Ticket = BuyTicket | SellTicket;

function Card({ price, quantity, timestamp }: any) {
	const dateString = new Date(timestamp).toLocaleString();

	return (
		<StyledCard>
			<p>{dateString}</p> <p>{`${quantity} @ ${price}`}</p>
		</StyledCard>
	);
}

function Row({ row }: { row: Ticket[] }) {
	return (
		<StyledRow>
			{row.map((ticket) => (
				<Card key={ticket.toString()} {...ticket} />
			))}
		</StyledRow>
	);
}

export default function Activity() {
	// Each displayed row represents the tickets/trades for a single ticker.
	const rows: { [k: string]: Array<BuyTicket | SellTicket> } = {};

	// Create an object with type {[k: ticker]: Array<Ticket>}
	for (const ticket of tickets) {
		const { ticker } = ticket;

		if (!(ticker in rows)) {
			rows[ticker] = [ticket];
		} else {
			rows[ticker].push(ticket);
		}
	}

	const tickers = Object.keys(rows);

	return (
		<>
			{Object.values(rows).map((row, index) => (
				<Row key={row[0].ticker} row={row} />
			))}
		</>
	);
}
