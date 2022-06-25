import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";

// `store` needs to match the name of our Docker Redis service
export const redisClient = new Redis("redis://store:6379");
export const RedisStore = connectRedis(session);

/**
 * Initialize a Redis session for use with express-session.
 * @usage Will be used in index.ts `as app.use(session(redisSession))`.
 */
export const redisSession: session.SessionOptions = {
	store: new RedisStore({ client: redisClient }),
	saveUninitialized: false,
	secret: process.env.SESSION_SECRET,
	resave: false,
	cookie: {
		maxAge: 7 * 24 * 3600 * 1000, // One week.
		secure: process.env.NODE_ENV === "production",
	},
};

/**
 * Connect to redisClient if not connected yet.
 * @todo Consider implementing retry functionality.
 */
export async function startRedis() {
	try {
		if ((await redisClient.ping()) !== "PONG") {
			await redisClient.connect();
		}
	} catch (error) {
		console.log({
			message: "Error while trying to connect to Redis client",
			error,
		});
	}
}
