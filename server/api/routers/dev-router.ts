import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import {
	BackendApiObject,
	PriceActionApiObject,
} from "../../database/pools/query-objects";
import { fetchPriceActionForTicker } from "../../price-action/database/queries/fetch-price-action";
import {
	// eslint-disable-next-line camelcase
	dev_firstAndLastMaxOneMinuteDataResultRow,
	fetchAndInsertMaxOneMinuteData,
	fetchMaxOneMinuteData,
} from "../../price-action/database/_dev/polygon/max-1m-query";
import { fetchSnapshotWithLimiter } from "../../price-action/lib/polygon/requests/snapshot/fetch";
import { fetchAndInsertSnapshot } from "../../price-action/lib/polygon/requests/snapshot/insert";
import { addSnapshotFetchJobs } from "../../price-action/lib/queue/snapshot/add-fetch-job";
import {
	addJob,
	repeatQueue,
} from "../../price-action/lib/queue/snapshot/repeat-queue";
import { snapshotQueue } from "../../price-action/lib/queue/snapshot/snapshot-queue";
import { getAllMarketDaysInPastTwoYears } from "../../price-action/lib/time/dates";
import { formatYMD } from "../../price-action/lib/time/format-YMD";
import { rateLimiter } from "../../price-action/store/rate-limit";
import { snapshotStore } from "../../price-action/store/snapshot-dates";
import { fetchExistingSnapshotTimestamps } from "../../price-action/store/snapshot-reconcile";
import { redisClient } from "../../store/redis-client";
import { getTradesWithTickets } from "../database/queries/trades/get";
import { getTradeDetails } from "../helpers/trades/trade-meta";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * API endpoints to be used in development only
 */
export const devRouter = express.Router({ mergeParams: true });

devRouter.get("/daily/all", async (req, res) => {
	const response = await fetchSnapshotWithLimiter({ date: "2021-12-13" });
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

	res.json({
		resultEndpoints: dev_firstAndLastMaxOneMinuteDataResultRow(response),
	});
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

	const timestamp = await fetchAndInsertSnapshot(date);
	res.json({ timestamp });
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

	const trades = await getTradesWithTickets("seerden", ["msft", "aapl"]);
	// const response = await getUserId("seerden");

	const tradesWithMetadata = trades.map((trade) => ({
		...trade,
		...getTradeDetails(trade),
	}));

	res.json({ tradesWithMetadata });
});

devRouter.get("/snapshot/raw/:date", async (req, res) => {
	const { date } = req.params;
	const response = await fetchSnapshotWithLimiter({ date });

	res.json({ response });
});

devRouter.get("/snapshot/saved/dates", async (req, res) => {
	const dates = await snapshotStore.get();

	res.json({ dates });
});

devRouter.post("/snapshot/reset", async (req, res) => {
	// delete redis set `snapshot:dates`
	// remove all rows from price_action_1d
});

devRouter.get("/rate-test", async (req, res) => {
	const countStart = await rateLimiter.getRequestCount();
	await rateLimiter.incrementRequestCount();
	const countEnd = await rateLimiter.getRequestCount();

	res.json({
		countStart,
		countEnd,
		canMakeRequest: await rateLimiter.isWithinRateLimit(),
	});
});

devRouter.get("/defer", async (req, res) => {
	const response = await rateLimiter.fetch(
		100,
		async () => await redisClient.get("request-count")
	);

	res.json({ response });
});

devRouter.get("/snapshot/defer", async (req, res) => {
	const response = await fetchSnapshotWithLimiter({ date: "2022-04-13" });

	const requestCount = await rateLimiter.getRequestCount();
	res.json({ response, requestCount });
});

devRouter.get("/job-counts", async (req, res) => {
	const counts = await snapshotQueue.getJobCounts();

	const failed = await snapshotQueue.getFailed();
	const completed = await snapshotQueue.getCompleted();

	res.json({ counts, failed, completed });
});

devRouter.get("/job/add/:date", async (req, res) => {
	const { date } = req.params;
	const returnvalue = await addSnapshotFetchJobs([date]);

	res.json({ returnvalue });
});

devRouter.get("/job/return/:id", async (req, res) => {
	const { id } = req.params;

	if (!id) return res.json({ message: "no job id specified" });

	const job = await snapshotQueue.getJob(id);

	res.json({ job });
});

devRouter.get("/job/repeat/add", async (req, res) => {
	let repeatableJobs = await repeatQueue.getRepeatableJobs();

	console.log({ repeatableJobs });

	await addJob();

	repeatableJobs = await repeatQueue.getRepeatableJobs();
	console.log({ repeatableJobs });

	res.json({ repeatableJobs });
});

devRouter.get("/job/repeat/all", async (req, res) => {
	const jobs = await repeatQueue.getRepeatableJobs();
	const allJobs = await repeatQueue.getJobs();

	// await repeatQueue.removeRepeatable("delay", {
	// 	cron: "* * * * *",
	// });

	res.json({ jobs, allJobs });
});

devRouter.get("/job/snapshot/backlog", async (req, res) => {
	const dates = getAllMarketDaysInPastTwoYears();
	const jobs = await addSnapshotFetchJobs(dates);

	res.json({ jobs });
});

devRouter.get("/price-action/high-volume", async (req, res) => {
	console.time("high-vol-query");
	const rows = await PriceActionApiObject.query({
		text: "select * from price_action_1d where volume > 5e8 order by volume",
	});

	res.json({ rows });
	console.timeEnd("high-vol-query");
});

devRouter.get("/snapshots/timestamps/reconcile", async (req, res) => {
	const [{ timestamps }] = await fetchExistingSnapshotTimestamps();

	const dates = timestamps.map((t: string) => formatYMD(t));

	const response = await snapshotStore.bulkAdd(dates);

	res.json({ response });
});
