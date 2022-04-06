import { TradeWithTickets } from "../../database/queries/trades/get";

/**
 * Get metadata for a trade
 * - realized profit/loss
 * - trade duration
 * - avg. buy and sell price
 * - position size: open and closed
 */
export function getTradeDetails(tradeWithTickets: TradeWithTickets) {
	const { trade, tickets } = tradeWithTickets;
}

/**
 * Get the average price of all buy or sell tickets from an array of tickets.
 * Returns an unrounded number.
 */
export function getAverage(
	tickets: TradeWithTickets["tickets"],
	sides: Array<"buy" | "sell">
) {
	const response: { [K in "buy" | "sell"]?: number } = {};

	for (const side of new Set(sides)) {
		const ticketsPerSide = tickets.filter((t) => t.action === side);
		if (!ticketsPerSide?.length) return;

		let shareCount = 0;
		let totalCost = 0;

		for (const ticket of ticketsPerSide) {
			const { quantity, price } = ticket;
			shareCount += quantity;
			totalCost += quantity * price;
		}

		response[side] = totalCost / shareCount;
	}
}

export type Tickets = TradeWithTickets["tickets"];

/**
 * Given a list of tickets, determine the current quantity.
 * Returns 0 if trade has been closed out, < 0 if active short
 * position, and > 0 if active long position.
 *
 * @param ticker: if specified, filter the list of tickets by `ticket.ticker === ticker`
 */
export function getOpenQuantity(tickets: Tickets, ticker?: string) {
	let runningQuantity = 0;

	if (ticker) {
		tickets = tickets.filter((t) => t.ticker === ticker);
	}

	if (!tickets?.length) return runningQuantity;

	for (const { quantity, action } of tickets) {
		runningQuantity += (action === "buy" ? 1 : -1) * quantity;
	}

	return runningQuantity;
}

/**
 * Get the timestamp(s) of the first (and in the case of a closed trade, last)
 * ticket in a list of `tickets`.
 *
 * @todo: in this implementation, we just subtract the first `timestamp` from
 * the last one. Whether this returns a value in UNIX milliseconds, or in
 * seconds, depends on the one we end up inserting into the database to begin with.
 *
 * @param ticker: if specified, filter the list of tickets by `ticket.ticker === ticker`
 */
export function getTimestampRange(tickets: Tickets, ticker?: string) {
	if (ticker) {
		tickets = tickets.filter((t) => t.ticker === ticker);
	}
	const openQuantity = getOpenQuantity(tickets);

	// Sort tickets from latest to eldest.
	const descendingTimestamps = tickets.map((t) => t.timestamp).sort((a, b) => b - a);

	const firstTimestamp = descendingTimestamps.at(-1);
	let latestTimestamp: number;
	// Trade is still active
	if (openQuantity === 0) {
		// eslint-disable-next-line prefer-destructuring
		latestTimestamp = descendingTimestamps[0];
	}

	return {
		firstTimestamp,
		latestTimestamp,
	};
}
