import express from "express";
import { insertTickets } from "../database/queries/tickets/insert";
import { getTradesByUser, getTradesWithTickets } from "../database/queries/trades/get";
import { getUserId } from "../database/queries/users/get";
import { isAllowed } from "../helpers/middleware/is-allowed";

/**
 * Router that handles everything related to our users' tickets and trades
 * @see documentation\server\endpoints.md
 */
export const tradeRouter = express.Router({ mergeParams: true });
tradeRouter.use(isAllowed);

tradeRouter.get("/tickets/:ticker?/:from?/:to?", async (req) => {
	/**
	 * as described in ...\endpoints.md, this endpoint can be interacted with in
	 * multiple ways:
	 * - /t/tickets?ids=[...]
	 * - /t/tickets/:ticker/:from/:to
	 *
	 * As far as I can tell, there's no way to force either NO params, or ALL params,
	 * but we can manually handle this by checking if { ticker, from, to } all
	 * exist, of course
	 */

	if ("ticker from to".split(" ").every((param) => param in req.params)) {
		// get tickets by ticker in date range [from, to]
	} else if ("ids" in req.query && req.query.ids.length) {
		// get tickets by ids
	}
});

tradeRouter.post("/tickets", async (req, res) => {
	const { newTickets, username } = req.body;

	if (newTickets?.length && username) {
		const savedTickets = await insertTickets({
			username,
			tickets: newTickets,
		});
		res.json({ savedTickets });
	} else {
		res.json({
			message: "Request body does not contain `newTickets` array or `username` string",
		});
	}
});

/** Get a user's trades filtered by query string options */
tradeRouter.get("/trades/", async (req, res) => {
	// TODO: down the road, when implementing filtering results, work with query
	// string here to allow for most malleable handling.

	const { username } = req.user as { username?: string };

	const trades = getTradesByUser({ userId: await getUserId(username) });
	res.json({ trades });
});

tradeRouter.get("/trades/tickets", async (req, res) => {
	const { username, tickers } = req.query;

	if (tickers && !Array.isArray(tickers)) {
		res.status(400).json({ message: "Query param 'tickers' has invalid shape" });
	}

	try {
		const trades = await getTradesWithTickets(username as string, tickers as string[]);
		res.json({ trades });
	} catch (error) {
		console.error(error);
	}
});
