import { Router } from "express";
import { fetchDailyMovers } from "../../price-action/database/queries/daily-movers";
import { getDailyMostActive } from "../../price-action/database/queries/most-active";

export const priceActionRouter = Router({ mergeParams: true });

priceActionRouter.get("/tickers/:date/active", async (req, res) => {
	const { date } = req.params;

	const response = await getDailyMostActive({ date });

	res.json({ response });
});

priceActionRouter.get("/ticker/:date/gainers/:direction", async (req, res) => {
	const rows = await fetchDailyMovers(
		req.params.date,
		300,
		req.params.direction === "up" ? "gainers" : "losers"
	);

	res.json({ response: rows });
});
