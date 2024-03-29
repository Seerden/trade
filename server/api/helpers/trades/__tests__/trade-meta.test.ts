import {
	getAverage,
	getOpenQuantity,
	getRealizedProfit,
	getTimestampRange,
	Tickets,
} from "../trade-meta";

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
			lastTimestamp: null,
		});
	});

	test("return correct range for closed trade", () => {
		const result = getTimestampRange(closedTradeTickets);
		expect(result).toEqual({
			firstTimestamp: 10,
			lastTimestamp: 20,
		});
	});
});

describe("getAverage", () => {
	const tickets: Tickets = [
		{
			...snippet,
			action: "buy",
			quantity: 50,
			price: 1,
			ticket_id: 1,
			timestamp: 1,
		},
		{
			...snippet,
			action: "buy",
			quantity: 50,
			price: 2,
			ticket_id: 2,
			timestamp: 2,
		},
	];

	test("returns proper average if only buy tickets present", () => {
		let result = getAverage(tickets);

		expect(result).toEqual({
			buy: 1.5,
			sell: null,
		});

		result = getAverage(tickets);

		expect(result).toEqual({
			buy: 1.5,
			sell: null,
		});
	});

	test("returns proper average if both buy and sell tickets present", () => {
		tickets.push({
			...snippet,
			price: 1,
			action: "sell",
			ticket_id: 3,
			quantity: 50,
			timestamp: 3,
		});

		const result = getAverage(tickets);
		expect(result).toEqual({
			buy: 1.5,
			sell: 1,
		});
	});
});

describe("getRealizedProfit", () => {
	const tickets: Tickets = [
		{
			...snippet,
			action: "buy",
			quantity: 50,
			price: 1,
			ticket_id: 1,
			timestamp: 1,
		},
		{
			...snippet,
			action: "sell",
			quantity: 50,
			price: 2,
			ticket_id: 2,
			timestamp: 2,
		},
	];

	test("returns correct P&L for a trade with at least one buy and one sell ticket", () => {
		const result = getRealizedProfit(tickets);
		expect(result).toBe(50);
	});

	test("returns correct profit if multiple entries and exits", () => {
		expect(getRealizedProfit([...tickets, ...tickets])).toBe(100);
	});

	test("returns correct profit (0) if 0 shares bought or 0 shares sold", () => {
		tickets[0].quantity = 0;
		expect(getRealizedProfit(tickets)).toBe(0);
	});

	test("returns correct profit if trade not complete", () => {
		tickets[0].quantity = 50;
		tickets.push({ ...tickets[0], price: 100, timestamp: 3 });
		expect(getRealizedProfit(tickets)).toBe(50);
	});
});
