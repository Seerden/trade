import { getOpenQuantity, getTimestampRange, Tickets } from "../trade-meta";

const snippet = {
	price: 100,
	trade_id: 1,
	user_id: 1,
	ticker: "MSFT",
};

const longTickets: Tickets = [
	{
		...snippet,
		action: "buy",
		quantity: 100,
		ticket_id: 1,
		timestamp: 10,
	},
	{
		...snippet,
		action: "sell",
		quantity: 50,
		ticket_id: 2,
		timestamp: 20,
	},
];

const shortTickets: Tickets = [
	{
		...snippet,
		action: "sell",
		quantity: 100,
		ticket_id: 1,
		timestamp: 10,
	},
	{
		...snippet,
		action: "buy",
		quantity: 50,
		ticket_id: 2,
		timestamp: 20,
	},
];

const closedTradeTickets: Tickets = [
	{
		...snippet,
		action: "buy",
		quantity: 50,
		ticket_id: 1,
		timestamp: 10,
	},
	{
		...snippet,
		action: "sell",
		quantity: 50,
		ticket_id: 1,
		timestamp: 20,
	},
];

describe("getOpenQuantity", () => {
	test("return correct quantity for open long trade", () => {
		const result = getOpenQuantity(longTickets);

		expect(result).toEqual(50);
	});

	test("return correct quantity for open short trade", () => {
		const result = getOpenQuantity(shortTickets);

		expect(result).toEqual(-50);
	});

	test("return correct quantity for closed trade", () => {
		const result = getOpenQuantity(closedTradeTickets);
		expect(result).toEqual(0);
	});
});

describe("getTimestampRange", () => {
	test("return correct range for open trade", () => {
		const result = getTimestampRange(shortTickets);
		expect(result).toEqual({
			firstTimestamp: 10,
		});
	});

	test("return correct range for closed trade", () => {
		const result = getTimestampRange(closedTradeTickets);
		expect(result).toEqual({
			firstTimestamp: 10,
			latestTimestamp: 20,
		});
	});
});
