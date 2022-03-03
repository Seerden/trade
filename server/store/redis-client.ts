import connectRedis from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

export const redisClient = createClient({
    url: "redis://store:6379", // note that `store` is the name we give to the redis service in docker-compose.yml
    legacyMode: true,
});

export const RedisStore = connectRedis(session);

export const redisSession: session.SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
        maxAge: 7 * 24 * 3600 * 1000, // max age is a week by default
        secure: process.env.NODE_ENV === "production",
    },
};

export async function startRedis() {
    await redisClient.connect();
    redisClient.on("connected", () => console.log("connected"));
    redisClient.on("error", (e) => console.log(e));
}
