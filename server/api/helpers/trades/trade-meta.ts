import { TradeWithTickets } from "../../database/queries/trades/get";

/**
 * Get the average price of all buy or sell tickets from an array of tickets.
 * Returns an unrounded number.
 */
export function getAverage(tickets: TradeWithTickets["tickets"]) {
	const response: { [K in "buy" | "sell"]?: null | number } = {
		buy: null,
		sell: null,
	};

	for (const side of ["buy", "sell"] as const) {
		const ticketsPerSide = tickets.filter((t) => t.action === side);
		if (!ticketsPerSide?.length) {
			response[side] = null;
			continue;
		}

		let shareCount = 0;
		let totalCost = 0;

		for (const ticket of ticketsPerSide) {
			const { quantity, price } = ticket;
			shareCount += quantity;
			totalCost += quantity * price;
		}

		response[side] = totalCost / shareCount;
	}

	return response;
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
 * ticket in a list of `tickets`. If a trade isn't closed yet, lastTimestamp
 * will be falsy.
 *
 * @todo: in this implementation, we just subtract the first `timestamp` from
 * the last one. Whether this returns a value in UNIX milliseconds, or in
 * seconds, depends on the one we end up inserting into the database to begin with.
 *
 * @param ticker: if specified, filter the list of tickets by `ticket.ticker === ticker`
 */
export function getTimestampRange(
	tickets: Tickets,
	ticker?: string
): {
	firstTimestamp: number;
	lastTimestamp: Maybe<number>;
} {
	if (ticker) {
		tickets = tickets.filter((t) => t.ticker === ticker);
	}
	const openQuantity = getOpenQuantity(tickets);

	// Sort tickets from latest to eldest.
	const descendingTimestamps = tickets.map((t) => t.timestamp).sort((a, b) => b - a);

	const firstTimestamp = descendingTimestamps.at(-1);
	let lastTimestamp: Maybe<number> = null;

	// Trade is still active
	if (openQuantity === 0) {
		// eslint-disable-next-line prefer-destructuring
		lastTimestamp = descendingTimestamps[0];
	}

	return {
		firstTimestamp,
		lastTimestamp,
	};
}

/**
 * Get metadata for a trade
 * - realized profit/loss
 * - trade duration
 * - avg. buy and sell price
 * - position size: open and closed
 */
export function getTradeDetails(tradeWithTickets: TradeWithTickets) {
	const { tickets } = tradeWithTickets;

	return {
		average: getAverage(tickets),
		timeInterval: getTimestampRange(tickets),
	};
}

/**
 * Extract the realized P&L from a trade.
 */
export function getRealizedProfit(tickets: Tickets) {
	const { buy: avgBuy, sell: avgSell } = getAverage(tickets);

	// TODO: we should really distinguish between a trade that is fully realized,
	// and one that is closed out with a P&L of exactly $0, but let's worry about
	// that later.
	if (!avgBuy || !avgSell) return 0;

	// Tickets should be sorted by timestamp already, but re-sort just in case
	const sortedTickets = tickets.sort((a, b) => a.timestamp - b.timestamp);

	const type = sortedTickets[0].action === "buy" ? "long" : "short";
	const closingAction = type === "long" ? "sell" : "buy";
	let openQuantity = 0;
	let avgCost = 0;
	let realized = 0;

	for (const { action, quantity, price } of tickets) {
		// avgCost only changes when adding to a position
		if (action !== closingAction) {
			avgCost = (avgCost * openQuantity + price * quantity) / (openQuantity + quantity);
		} else {
			// realized only changes when (partially) closing a position

			/* 
         If long:    sell @ 2 when avgCost = 1 ==> realized += (2-1)*qty
			If short:   buy @ 2 when avgCost = 1 ==> realized += -(2-1)*qty

         Hence we need a `sign` variable that equates to -1 when covering
         while in a short position, and +1 when selling while in  a long position
         */
			const sign = closingAction === "buy" ? -1 : 1;
			realized += sign * (price - avgCost) * quantity;
		}

		// openQuantity always changes after a ticket
		openQuantity += (action === closingAction ? -1 : 1) * quantity;
	}

	return realized;
}
