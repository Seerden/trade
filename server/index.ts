import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import cors from "cors";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { strategy } from "./api/helpers/auth/passport/config";
import { getUser } from "./api/helpers/auth/user";
import { logRequests } from "./api/helpers/middleware/log-requests";
import authRouter from "./api/routers/auth-router";
import { priceActionRouter } from "./api/routers/price-action-router";
import { tradeRouter } from "./api/routers/trade-router";
import { polygonSnapshotFetchWorker } from "./price-action/lib/queue/snapshot/polygon-queue";
import { redisSession, startRedis } from "./store/redis-client";

config();

async function main() {
	const app = express();

	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		tracesSampleRate: 1,
		autoSessionTracking: false,
		normalizeDepth: 10,
		integrations: [
			new Tracing.Integrations.Express({
				app,
			}),
		],
	});

	app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

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
	if (!polygonSnapshotFetchWorker.isRunning) {
		polygonSnapshotFetchWorker.run(); // only necessary if autorun = false
	}
	app.use(session(redisSession));

	passport.use(strategy);
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => done(null, user));

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
			done(e, false);
		}
	});

	if (!(process.env.NODE_ENV === "production")) {
		const { devRouter } = await import("./api/routers/dev-router");
		app.use("/", devRouter);
	}

	app.use("/auth", authRouter);
	app.use("/t", tradeRouter);
	app.use("/p", priceActionRouter);

	app.get("/", (req, res) => {
		res.json({ message: "/ GET successful" });
	});

	const instance = app.listen(process.env.PORT || 5000, () => {
		console.log(`Server started on ${new Date()}`);
	});

	// Uncomment below to gracefully shut down Express server and polygonSnapshot
	// BullMQ worker.
	// instance.close(async () => {
	// 	await polygonSnapshotFetchWorker.close();
	// 	console.log("Shut down express server.");
	// });

	app.use(Sentry.Handlers.errorHandler());

	/**
	 * Catch-all piece of middleware that handles errors during route handling.
	 *
	 * Use-case: Suppose a user has an authenticated session, and that the user is deleted from the
	 * database outside of the regular flow (regular flow would include a
	 * req.logout()), e.g. directly in the database, for whatever reason.
	 * If the user then tries to make a request, passport.deserialize()
	 * encounters an issue. We can only really fix this by forcibly logging the
	 * user out.
	 *
	 * @todo: Do we ever want to call next() in this case? Most endpoints will
	 * require an authenticated user, and handlers won't know in advance if (a) there
	 * simply isn't a valid user, or (b) if we encountered an error internally.
	 * Perhaps it's best to just call logout(), send a response like {error:
	 * "Encountered an error. Perhaps the user no longer exists"},
	 * and let the client handle what to do next (e.g. retry a few times, force
	 * the user to log in again, etc).
	 */
	app.use(
		(
			err: Error,
			req: Request,
			res: Response,
			next?: (args?: any) => unknown
		) => {
			if (err) {
				req.session = null;
				req.logout();

				// if (next) {
				// 	next();
				// } else {
				res.json({ error: err });
				// }
			}
		}
	);
}

main().catch((e) => console.error(e));
