import { NewTicket } from "types/ticket.types";
import { SavedTicket } from "../../useNewTickets";
import { isSavedTicket } from "../saved-tickets-match";

const newTickets = [
	{
		ticker: "TEST",
		price: 1,
		quantity: 1,
		action: "sell",
		timestamp: 1649554200000,
	},
] as NewTicket[];

const savedTickets = [
	{
		user_id: 1,
		trade_id: 34,
		ticket_id: 34,
		ticker: "TEST",
		timestamp: "1649554200000",
		action: "sell",
		quantity: "1",
		price: "1.000000",
	},
] as SavedTicket[];

describe("isSavedTicket", () => {
	test("returns true is newTicket is an entry of savedTickets", () => {
		const result = isSavedTicket(newTickets[0], savedTickets);

		expect(result).toEqual(true);
	});

	test("returns false if newTicket not in savedTickets", () => {
		savedTickets[0].ticker = "FAIL";

		const result = isSavedTicket(newTickets[0], savedTickets);

		expect(result).toEqual(false);
	});
});
