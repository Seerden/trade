import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { readFile } from "fs/promises";
import { PriceAPI } from "../../database/pools/apis";
import { getDailyMostActive } from "../../price-action/database/queries/most-active";
import { fetchSnapshotWithLimiter } from "../../price-action/lib/polygon/requests/snapshot/fetch";
import { writeAggregateTickerDateTuplesToFetchToFile } from "../../price-action/lib/queue/aggregate/aggregate-backlog";
import { queueAggregateBacklog } from "../../price-action/lib/queue/aggregate/queue-backlog";
import { polygonQueue } from "../../price-action/lib/queue/polygon-queue";
import { redisClient } from "../../store/redis-client";
import { snapshotRouter } from "./snapshot-router";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * API endpoints to be used in development only
 */
export const devRouter = express.Router({ mergeParams: true });
devRouter.use("/s", snapshotRouter);

/** Little speedtest for Redis retrieval. */
devRouter.get("/redis/speedtest", async (req, res) => {
	console.time("redis-speedtest");
	const keys = await redisClient.keys("*");
	console.timeEnd("redis-speedtest");

	res.json({ keys });
});

/** Check shape of getDailyMostActive() */
devRouter.get("/active", async (req, res) => {
	const response = await getDailyMostActive({ date: "2022-04-14" });

	res.json({ response });
});

devRouter.get("/aggregate-backlog", async (req, res) => {
	await writeAggregateTickerDateTuplesToFetchToFile();
	const writtenFile = await readFile("data/aggregate-tuples-to-fetch.json", {
		encoding: "utf-8",
	});

	res.json({ writtenFile: JSON.parse(writtenFile) });
});

devRouter.get("/aggregate-backlog/queue", async (req, res) => {
	if (!(await redisClient.get("aggregate:backlog:queued"))) {
		const queuedJobs = await queueAggregateBacklog();
		redisClient.set("aggregate:backlog:queued", 1);
		res.json({ queuedJobs });
	} else {
		res.json({ jobs: await polygonQueue.getJobs() });
	}
});

devRouter.get("/snapshot/raw/:date", async (req, res) => {
	res.json({
		response: await fetchSnapshotWithLimiter({ date: req.params.date }),
	});
});

devRouter.get("/1m/unique-tickers", async (req, res) => {
	const rows = await PriceAPI.query({
		text: `
   WITH RECURSIVE cte AS (
      (SELECT ticker FROM price_action_1m ORDER BY ticker LIMIT 1)
      UNION ALL
      SELECT (SELECT ticker FROM price_action_1m
              WHERE  ticker > t.ticker ORDER BY ticker LIMIT 1)
      FROM   cte t
      WHERE  t.ticker IS NOT NULL
      )
   SELECT array_agg(ticker) tickers, count(ticker) FROM cte;
   `,
	});

	res.json({ rows });
});
