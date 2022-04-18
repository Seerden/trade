import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
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
