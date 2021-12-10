import connectRedis from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

export const redisClient = createClient({
    url: "redis://store:6379", // note that `store` is the name we give to the redis service in docker-compose.yml
});

export const RedisStore = connectRedis(session);
