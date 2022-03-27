import { RawNewTicket } from "../NewTicket";

function parseNumberInput(decimals: number) {
	return (value: string) => String((+value).toFixed(decimals));
}

const parser: Partial<Record<keyof RawNewTicket, (value: string) => string | number>> = {
	// `action` doesn't have to be parsed, and date/time are parsed separately
	ticker: value => value.toUpperCase(),
	price: parseNumberInput(4),
	quantity: parseNumberInput(1)
};

/**
 * Take raw input values and parse to desired NewTicket type
 */
export function parseNewTicketInputs(
	ticket: RawNewTicket
): Record<keyof RawNewTicket, any> {
	const { ticker, date, price, quantity, side, time } = ticket;
	return {
		ticker: parser.ticker(ticker),
		date,
		price: parser.price(price),
		quantity: parser.quantity(quantity),
		side,
		time
	};
}

/**
 * Check if a new ticket's values make sense
 */
export function isValidTicket(ticket: ReturnType<typeof parseNewTicketInputs>) {
	const { date, price, quantity, side, ticker, time } = ticket;
	return (
		// TODO: probably want to parse date/time to datetime here, but haven't decided yet
		date.length && // TODO: also check if date isn't in the future
		price >= 0 &&
		(side === "buy" || "sell") &&
		quantity > 0 &&
		ticker.length &&
		time.length === 5
	);
}
