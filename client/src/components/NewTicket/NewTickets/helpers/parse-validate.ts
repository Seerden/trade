import { NewTicket } from "types/ticket.types";
import { RawNewTicket } from "../NewTicket";
import { toNewYorkTime } from "./date";

function parseNumberInput(decimals: number) {
	return (value: string) => +String((+value).toFixed(decimals));
}

const parser: Partial<Record<keyof RawNewTicket, (value: string) => string | number>> = {
	// `action` doesn't have to be parsed, and date/time are parsed separately
	ticker: (value) => value.toUpperCase(),
	price: parseNumberInput(4),
	quantity: parseNumberInput(1),
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
	const { ticker, date, price, quantity, action, time } = ticket;

	// TODO: do we want to keep these in UNIX seconds or milliseconds?
	const timestamp = new Date(toNewYorkTime(`${date} ${time}`)).valueOf();

	try {
		return {
			ticker: parser.ticker(ticker) as string,
			price: parser.price(price) as number,
			quantity: parser.quantity(quantity) as number,
			action,
			timestamp,
		};
	} catch (error) {
		return;
	}
}

/**
 * Validate a parsed new ticket's values.
 */
export function isValidTicket(ticket: ReturnType<typeof parseNewTicketInputs>) {
	// TODO: seriously need to extract these fields to a shared export instead of
	// re-implementing this fields variable all over the place
	const fields = "ticker price quantity action timestamp".split(" ") as Array<
		keyof RawNewTicket
	>;

	// Early return if ticket doesn't have a value for any of the necessary
	// fields. TODO: this could just be HTML validation
	if (!ticket || !fields.every((field) => ticket[field] !== undefined)) {
		return;
	}

	const { price, timestamp, quantity, action, ticker } = ticket;

	return (
		price >= 0 &&
		timestamp &&
		quantity >= 0 &&
		ticker &&
		"buy sell".split(" ").includes(action) &&
		new Date(timestamp).valueOf() > new Date(0).valueOf()
	);
}
