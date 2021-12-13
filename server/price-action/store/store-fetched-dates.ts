import dayjs from "dayjs";
import { redisClient } from "../../store/redis-client";
import type { DateDayjsOrString } from "../../types/date.types";
import type { Timescale } from "../../types/store.types";

/**
 * Whenever we fetch data from the yf API and store it in our database,
 * store the date range of the yf query in redis, so we can later compare
 * against already-fetched ranges, to make sure we don't unnecessarily
 * fetch (part of) the same date range again.
 *
 * @note format of fetched date ranged is YYYYMMDD,YYYYMMDD, where the first
 * date is the start of the fetched date interval, and the second date is the
 * end of the fetched interval
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
        dayjs(date).format("YYYYMMDD")
    );
    const startEndString = `${startString},${endString}`;
    await redisClient.rPush(
        `ranges:${timescale}:${ticker.toLowerCase()}`,
        startEndString
    );
}
