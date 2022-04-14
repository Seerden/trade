import { redisClient } from "../../store/redis-client";
import { delay } from "../lib/wait";

const requestCountKey = "request-count";

async function getRequestCount() {
	return await redisClient.get(requestCountKey);
}

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

export const rateLimit = {
	getRequestCount,
	incrementRequestCount,
	fetch: makePossiblyDeferredRequest,
	isWithinRateLimit,
};
