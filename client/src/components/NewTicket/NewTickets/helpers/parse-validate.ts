import { NewTicket } from "types/ticket.types";
import { RawNewTicket } from "../NewTicket";
import { toNewYorkTime } from "./date";

function parseNumberInput(decimals: number) {
	return (value: string) => +String((+value).toFixed(decimals));
}

const parser: Partial<Record<keyof RawNewTicket, (value: string) => string | number>> = {
	// `action` doesn't have to be parsed, and date/time are parsed separately
	ticker: value => value.toUpperCase(),
	price: parseNumberInput(4),
	quantity: parseNumberInput(1)
};

/**
 * Take raw input values and parse to desired NewTicket type
 *
 * @todo: parse date + time to new timestamp field
 *    use toNewYorkTime helper function for this,
 * @todo: once parsed, change return type of this function to NewTicket (unsure
 * if there already is a correct type definition for this)
 */
export function parseNewTicketInputs(ticket: RawNewTicket): NewTicket {
	const { ticker, date, price, quantity, side, time } = ticket;

	const timestamp = new Date(toNewYorkTime(`${date} ${time}`)).valueOf();

	return {
		ticker: parser.ticker(ticker) as string,
		price: parser.price(price) as number,
		quantity: parser.quantity(quantity) as number,
		side,
		timestamp
	};
}

/**
 * Check if a new ticket's values make sense
 */
export function isValidTicket(ticket: ReturnType<typeof parseNewTicketInputs>) {
	const { price, timestamp, quantity, side, ticker } = ticket;
	return (
		// TODO: probably want to parse date/time to datetime here, but haven't decided yet
		price >= 0 &&
		(side === "buy" || "sell") &&
		quantity > 0 &&
		ticker.length &&
		new Date(timestamp).valueOf() > new Date(0).valueOf()
	);
}
