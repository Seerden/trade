import express from "express";
import { getTradesByUser } from "../database/queries/trades/get";
import { getUserId } from "../database/queries/users/get";

/**
 * Router that handles everything related to our users' tickets and trades
 *
 * @see documentation\server\endpoints.md
 */
export const tradeRouter = express.Router({ mergeParams: true });

// ----
// TICKETS
// ----
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

tradeRouter.post("/tickets", async (req) => {
	const { newTickets } = req.body;

	if (newTickets?.length) {
		// insert tickets into database
	}
});

// ----
// TRADES
// ----
tradeRouter.get("/trades/", async (req, res) => {
	// work with query string here to allow for most malleable handling
	// get a user's trades filtered by query string options

	const trades = getTradesByUser({ userId: 1 || (await getUserId(req.user.username)) });
	res.json({ trades });
});

tradeRouter.get("/trades/all", async () => {
	// get all of a user's trades
});
