import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { fetchPriceActionForTicker } from "../../price-action/database/queries/fetch-price-action";
import {
	// eslint-disable-next-line camelcase
	dev_firstAndLastMaxOneMinuteDataResultRow,
	fetchAndInsertMaxOneMinuteData,
	fetchMaxOneMinuteData,
} from "../../price-action/database/_dev/polygon/max-1m-query";
import { fetchDailyOHLC } from "../../price-action/lib/polygon/requests/snapshot/snapshot-fetch";
import { fetchAndInsertSnapshot } from "../../price-action/lib/polygon/requests/snapshot/snapshot-insert";
import { getLatestTrade, getTradesWithTickets } from "../database/queries/trades/get";
import { getTradeDetails } from "../helpers/trades/trade-meta";

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

devRouter.get("/latest", async (req, res) => {
	const response = await getLatestTrade({
		userId: 1,
		tickers: ["aa"],
	});

	res.json({
		response,
	});
});

devRouter.get("/trades-with-tickets", async (req, res) => {
	/*
      Snippet: run this in postgres before testing /trades-with-tickets to ensure a user exists
      and at least one ticket + one trade exist.
      
      delete from tickets;
      delete from trades;

      delete from users;
      alter sequence users_user_id_seq restart with 1;
      insert into users (username, password) values ('seerden', 'test');
   
      ALTER SEQUENCE trades_trade_id_seq RESTART WITH 1;
      
      insert into trades (user_id, ticker, trade_type) values (
         1, 'msft', 'short'
      );
      insert into tickets (
         user_id, trade_id, ticker, timestamp, action, quantity, price
      ) values (
         1, 1, 'msft', 10, 'sell', 100, 320.20);
   */

	const trades = await getTradesWithTickets("seerden");
	// const response = await getUserId("seerden");

	const tradesWithMetadata = trades.map((trade) => ({
		...trade,
		...getTradeDetails(trade),
	}));

	res.json({ tradesWithMetadata });
});
