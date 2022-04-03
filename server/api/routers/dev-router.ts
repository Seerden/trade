import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { BackendApiObject } from "../../database/pools/query-objects";
import { fetchPriceActionForTicker } from "../../price-action/database/queries/fetch-price-action";
import {
	// eslint-disable-next-line camelcase
	dev_firstAndLastMaxOneMinuteDataResultRow,
	fetchAndInsertMaxOneMinuteData,
	fetchMaxOneMinuteData,
} from "../../price-action/database/_dev/polygon/max-1m-query";
import { fetchDailyOHLC } from "../../price-action/lib/polygon/requests/snapshot/snapshot-fetch";
import { fetchAndInsertSnapshot } from "../../price-action/lib/polygon/requests/snapshot/snapshot-insert";
import { insertTickets } from "../database/queries/tickets/insert";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * API endpoints to be used in development only
 */
export const devRouter = express.Router({ mergeParams: true });

devRouter.get("/daily/all", async (req, res) => {
	const response = await fetchDailyOHLC({ date: "2021-12-13" });
	res.json({ response });
});

devRouter.post("/:ticker/1m/:to", async (req, res) => {
	const { ticker, to } = req.params;

	res.json({
		ranges: await fetchAndInsertMaxOneMinuteData({
			ticker,
			to,
		}),
	});
});

devRouter.get("/:ticker/1m/max/:to", async (req, res) => {
	const { ticker, to } = req.params;

	const response = await fetchMaxOneMinuteData({ ticker, to });

	res.json({ resultEndpoints: dev_firstAndLastMaxOneMinuteDataResultRow(response) });
});

devRouter.get("/:ticker/1m/:from/:to", async (req, res) => {
	const { ticker, from, to } = req.params;
	const { limit } = req.query;

	const rows = await fetchPriceActionForTicker({
		timescale: "minute",
		ticker: ticker.toUpperCase(),
		from,
		to,
		limit: limit ? String(limit) : null,
	});

	res.json({ rows });
});

/**
 * Fetch and store in our database a market snapshot from a given day
 */
devRouter.post("/snapshot/:date", async (req, res) => {
	const { date } = req.params;
	res.json({ timestamp: await fetchAndInsertSnapshot({ date }) });
});

/**
 * Select all trades.
 */
devRouter.get("/all/trades", async (req, res) => {
	const response = await BackendApiObject.query({
		text: "select * from trades",
	});

	res.json({ response });
});

/**
 * Select all tickets.
 */
devRouter.get("/all/tickets", async (req, res) => {
	const response = await BackendApiObject.query({
		text: "select * from tickets",
	});

	res.json({ response });
});

devRouter.post("/tickets", async (req, res) => {
	const response = await insertTickets({
		username: "test",
		tickets: [{ action: "buy", price: 1, quantity: 1, ticker: "msft", timestamp: 1 }],
	});

	res.json({ response });
});
