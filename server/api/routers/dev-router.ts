import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { readFile } from "fs/promises";
import { getDailyMostActive } from "../../price-action/database/queries/most-active";
import { fetchSnapshotWithLimiter } from "../../price-action/lib/polygon/requests/snapshot/fetch";
import { writeAggregateTickerDateTuplesToFetchToFile } from "../../price-action/lib/queue/aggregate-backlog";
import { addSnapshotFetchJobs } from "../../price-action/lib/queue/snapshot/add-fetch-job";
import { redisClient } from "../../store/redis-client";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * API endpoints to be used in development only
 */
export const devRouter = express.Router({ mergeParams: true });

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

devRouter.get("/queue-snapshot-fetch-manually", async (req, res) => {
	res.json({ addedJobs: await addSnapshotFetchJobs(["2022-01-22"]) });
});

devRouter.get("/snapshot/raw/:date", async (req, res) => {
	res.json({
		response: await fetchSnapshotWithLimiter({ date: req.params.date }),
	});
});
