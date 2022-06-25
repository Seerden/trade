import { redisClient } from "../../store/redis-client";
import type { Datelike } from "../../types/date.types";
import type { Timescale } from "../../types/store.types";
import { formatYMD } from "../lib/time/format-YMD";

/**
 * Whenever we fetch price action from an external API, we store the date range of the
 * API query in redis, so we can later compare against already-fetched ranges, to make sure
 * we don't unnecessarily fetch (part of) the same date range again.
 *
 * @note an example redis key is `ranges:1m:MSFT`
 *
 * @note we store each fetched range as `YYYY-MM-DD,YYYY-MM-DD`, which represents `start,end`
 * of the interval.
 *
 * @todo Consider synchronizing with database on server startup.
 *
 * @returns all values in the redis list that we pushed the just-fetched range to.
 */
export async function storeFetchedDateRange({
	ticker,
	timescale,
	start,
	end,
}: {
	ticker: string;
	timescale: Timescale;
	start: Datelike;
	end: Datelike;
}) {
	const [startString, endString] = [start, end].map((date) => formatYMD(date));

	if (!startString || !endString) {
		// TODO: trigger a Sentry message here
		return;
	}
	const startEndString = `${startString},${endString}`;
	const storeKey = `ranges:${timescale}:${ticker.toUpperCase()}`;
	await redisClient.rpush(storeKey, startEndString);
	return await redisClient.lrange(storeKey, 0, -1);
}
