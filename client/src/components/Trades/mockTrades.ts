/**
   Export a few mock objects containing trades and trade tickets.

 */

import { BuyTicket, SellTicket } from "../../types/tickets";

const tickers = "AAPL MSFT META".split(" ");

function getRandomSign() {
	const randomValue = Math.random().toFixed(1);

	return +randomValue >= 0.5 ? 1 : -1;
}

const now = new Date().valueOf();
const hour = 3600 * 1000; // 1 hour in ms

// Compute a random timestamp in a domain [now-25hr, now+25hr]
function getRandomNearbyTimestamp() {
	return now + hour * 25 * (1 + +Math.random().toFixed(1)) * getRandomSign();
}

export const tickets = [...Array(30).keys()].map((x) => ({
	action: "buy",
	price: 1,
	quantity: 100,
	ticker: tickers[(10 * +Math.random().toFixed(1)) % 3],
	timestamp: getRandomNearbyTimestamp(),
})) as Array<BuyTicket | SellTicket>;
