import { redisClient } from "../../store/redis-client";

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
