import dayjs from "dayjs";
import { redisClient } from "../../store/redis-client";
import type { DateDayjsOrString } from "../../types/date.types";
import type { Timescale } from "../../types/store.types";

/**
 * Whenever we fetch price action from an external API, we store the date range of the
 * API query in redis, so we can later compare against already-fetched ranges, to make sure
 * we don't unnecessarily fetch (part of) the same date range again.
 *
 * @note an example redis key is `ranges:1m:MSFT`
 * @note We store each fetched range as `YYYY-MM-DD,YYYY-MM-DD`, which represents `start,end`
 * of the interval.
 */
export async function storeFetchedDateRange({
    ticker,
    timescale,
    start,
    end,
}: {
    ticker: string;
    timescale: Timescale;
    start: DateDayjsOrString;
    end: DateDayjsOrString;
}) {
    const [startString, endString] = [start, end].map((date) =>
        dayjs(date).format("YYYY-MM-DD")
    );
    const startEndString = `${startString},${endString}`;
    const storeKey = `ranges:${timescale}:${ticker.toUpperCase()}`;
    await redisClient.rPush(storeKey, startEndString);
    return await redisClient.lRange(storeKey, 0, -1);
}
