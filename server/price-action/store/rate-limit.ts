import dayjs from "dayjs";
import { redisClient } from "../../store/redis-client";
import { DateDayjsOrString } from "../../types/date.types";

function timestampStartOfMinute(date: DateDayjsOrString) {
	return dayjs(date).startOf("minute").valueOf();
}

/** Get the Redis key for the current minute, i.e. `req:{timestamp}`. */
function getMinuteStoreKey(date: DateDayjsOrString) {
	const timestamp = timestampStartOfMinute(date);

	if (Number.isNaN(timestamp)) return;

	return `req:${timestamp}`;
}

/** Increment the number of Polygon requests made for the current minute slot. */
export async function incrementRequestCount() {
	const storeKey = getMinuteStoreKey(new Date());

	if (!storeKey) return;

	return await redisClient.incr(storeKey);
}

/**
 * Get value of Redis key `${minuteStoreKey}, where minuteStoreKey is the
 * return value of `getMinuteStoreKey`.
 */
async function getMinuteStoreValue(minuteStoreKey: string) {
	return await redisClient.get(minuteStoreKey);
}

/**
 * Check if the next Polygon request is allowed right now. Returns false if
 * we've already made 5 requests this minute.
 */
export async function polygonRequestAllowed() {
	const now = new Date();
	const key = getMinuteStoreKey(now);
	const requestCount = await getMinuteStoreValue(key);

	if (!requestCount || +requestCount < 5) return true;

	return false;
}
