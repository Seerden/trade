import express from "express";
import { insertTickets } from "../database/queries/tickets/insert";
import { getTradesByUser } from "../database/queries/trades/get";
import { getUserId } from "../database/queries/users/get";

/**
 * Router that handles everything related to our users' tickets and trades
 * @see documentation\server\endpoints.md
 */
export const tradeRouter = express.Router({ mergeParams: true });

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
		const response = await insertTickets({
			username,
			tickets: newTickets,
		});
		res.json({ response });
	} else {
		res.json({
			message: "Request body does not contain `newTickets` array or `username` string",
		});
	}
});

tradeRouter.get("/trades/", async (req, res) => {
	// work with query string here to allow for most malleable handling
	// get a user's trades filtered by query string options

	// @ts-ignore
	const { username } = req.user;

	const trades = getTradesByUser({ userId: await getUserId(username) });
	res.json({ trades });
});

tradeRouter.get("/trades/all", async () => {
	// get all of a user's trades
});
