import cors from "cors";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { strategy } from "./api/helpers/auth/passport/config";
import { getUser } from "./api/helpers/auth/user";
import authRouter from "./api/routers/auth-router";
import { tradeRouter } from "./api/routers/trade-router";
import { redisSession, startRedis } from "./store/redis-client";

config();

function logRequests(req: Request, res: Response, next: (...args: any) => any) {
	const { method, url, body, query } = req;
	console.log({
		method,
		url,
		body,
		query,
	});
	next();
}

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
	app.use(logRequests);
	app.use(
		cors({
			// TODO: origin should probably be different in production
			origin: "http://localhost:3000",
			methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
			credentials: true,
		})
	);

	await startRedis();
	app.use(session(redisSession));

	passport.use(strategy);
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user: any, done) => done(null, user));

	passport.deserializeUser(async (user: { username: string }, done) => {
		try {
			const [foundUser] = await getUser(user.username);
			// Check if foundUser exists because of the following usecase:
			//  - user has an active session cookie
			//  - user gets deleted from the database
			//  - user tries to make an API call
			//  In this case, foundUser will be undefined, and trying to do done(null, foundUser) leads to messiness)
			if (foundUser && "username" in foundUser) {
				return done(null, foundUser);
			}
			return done("User not found");
		} catch (e) {
			done(e);
		}
	});

	if (!(process.env.NODE_ENV === "production")) {
		const { devRouter } = await import("./api/routers/dev-router");
		app.use("/", devRouter);
	}

	app.use("/auth", authRouter);
	app.use("/t", tradeRouter);

	app.get("/", (req, res) => {
		res.json({ message: "/ GET successful" });
	});

	app.listen(process.env.PORT || 5000, () => {
		console.log(`Server started on ${new Date()}`);
	});
}

main().catch((e) => console.error(e));
