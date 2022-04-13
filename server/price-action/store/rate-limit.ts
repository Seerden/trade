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

export const rateLimit = {
	getRequestCount,
	incrementRequestCount,
	async isWithinRateLimit() {
		const count = await getRequestCount();
		return +count < 5;
	},
};

export async function makePossiblyDeferredRequest(
	delayMilliseconds: number,
	callback: (args?: unknown) => unknown
) {
	const isAllowed = await rateLimit.isWithinRateLimit();

	if (!isAllowed) {
		await delay(delayMilliseconds);
	}

	// `callback` can be an async function, but return await doesn't do anything
	// anyway, so don't await it, for once.
	return callback();
}
