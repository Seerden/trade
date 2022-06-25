import { redisClient } from "../../store/redis-client";
import { delay } from "../lib/wait";

/**
 * The purpose of the rateLimiter helper is to prevent making too many requests
 * to the Polygon API. As it stands, we're on a free plan, meaning we can only
 * make 5 requests per minute. This helper ensures that we don't exceed that
 * limit as follows: when we make a request, we reset the expiry in our memory
 * store to 60 seconds. When the counter reaches 5 (requests in the past
 * minute), we wait 60 seconds before making the next request.
 *
 * @note This is a very crudely implemented solution. Instead of tracking how
 * many requests we made in the past minute, we're just resetting the expiry
 * after every request, meaning that if we make successive requests spaced by 59.999...
 * seconds, the counter will only reset itself after it forces a 60 seconds wait
 * after request #5.
 */

const requestCountKey = "request-count";

async function getRequestCount() {
	return await redisClient.get(requestCountKey);
}

/** Increment request count by one and reset expiry to 60 seconds hence. */
async function incrementRequestCount() {
	return await redisClient
		.multi()
		.incr(requestCountKey)
		.expire(requestCountKey, 60)
		.exec();
}

async function isWithinRateLimit() {
	const count = await getRequestCount();
	return +count < 5;
}

async function makePossiblyDeferredRequest(
	delayMilliseconds: number,
	callback: (args?: unknown) => unknown
) {
	const isAllowed = await isWithinRateLimit();

	if (!isAllowed) {
		await delay(delayMilliseconds);
	}

	try {
		const response = await callback();
		return response;
	} catch (e) {
		// TODO: generally, errors/empty states that end up being passed to an
		// Express route handler should probably have a predefined shape. We also
		// want to log these to Sentry.
		console.error(e);
	} finally {
		await incrementRequestCount();
	}
}

export const rateLimiter = {
	getRequestCount,
	incrementRequestCount,
	fetch: makePossiblyDeferredRequest,
	isWithinRateLimit,
};
