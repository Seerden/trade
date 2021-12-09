import connectRedis from "connect-redis";
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import { createClient } from "redis";
import { makePooledQuery } from "./price-action/database/pool/query-functions";
config();

const redisClient = createClient({
    url: "redis://store:6379", // note that `store` is the name we give to the redis service in docker-compose.yml
});
const RedisStore = connectRedis(session);

async function main() {
    const app = express();
    app.use(
        express.urlencoded({
            limit: "5mb",
            parameterLimit: 100,
            extended: true,
        })
    );
    app.use(express.json());
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
        })
    );

    await redisClient.connect();
    redisClient.on("connected", () => console.log("connected"));
    redisClient.on("error", (e) => console.log(e));

    app.get("/", (req, res) => {
        res.json({ message: "/ GET successful" });
    });

    app.get("/pg", async (req, res) => {
        const response = await makePooledQuery({
            text: `select * from price_action`,
        });

        res.json({ response });
    });

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on ${new Date()}`);
    });
}

main().catch((e) => console.error(e));
