import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";

// `store` needs to match the name of our Docker Redis service
export const redisClient = new Redis("redis://store:6379");
export const RedisStore = connectRedis(session);

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

export async function startRedis() {
	try {
		await redisClient.connect();
		redisClient.on("connected", () =>
			console.log("Successfully connected to Redis client")
		);
		redisClient.on("error", (e) => console.log(e));
	} catch (error) {
		console.log({
			message: "Error while trying to connect to Redis client",
			error,
		});
	}
}
