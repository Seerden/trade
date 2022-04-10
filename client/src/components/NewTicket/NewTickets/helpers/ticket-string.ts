import dayjs from "dayjs";
import type { NewTicket, SavedTicket } from "types/tickets";

export function makeTicketString(ticket: NewTicket | SavedTicket) {
	const { ticker, quantity, timestamp, action, price } = ticket;

	const dateString = dayjs(+timestamp).format("MMMM D, YYYY");
	const timeString = dayjs(+timestamp).format("HH:mm");

	// TODO: if quantity === 1, use 'share' instead of 'shares'
	// Note that the number casting (`+quantity`) is to ensure the correct result
	// for both types  (NewTicket | SavedTicket)
	const ticketString = `${action} ${+quantity} shares of ${ticker} for ${+price} at ${timeString} on ${dateString}`;

	return ticketString;
}
