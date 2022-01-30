/* dayjs configuration
    note that, currently, dayjs extensions are global,
    keep that in mind for if we ever need to diverge from the
    extensions applied below
*/
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import authRouter from "./api/routers/auth-router";
import { redisClient, RedisStore } from "./store/redis-client";

config();

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

    if (!(process.env.NODE_ENV === "production")) {
        const { devRouter } = await import("./api/routers/dev-router");
        app.use("/", devRouter);
    }

    // @todo - finalize implement auth routes (register, login, logout...)
    app.use("/auth", authRouter);

    app.get("/", (req, res) => {
        res.json({ message: "/ GET successful" });
    });

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on ${new Date()}`);
    });
}

main().catch((e) => console.error(e));
