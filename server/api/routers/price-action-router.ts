import dayjs from "dayjs";
import { Router } from "express";
import { fetchDailyMovers } from "../../price-action/database/queries/daily-movers";
import { fetchPriceActionForTicker } from "../../price-action/database/queries/fetch-price-action";
import { getDailyMostActive } from "../../price-action/database/queries/most-active";
import { PermittedTimespan } from "../../price-action/lib/polygon/types/aggregate.types";

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

function isValidTimespan(timespan: string): timespan is PermittedTimespan {
	return "day, hour, minute".split(", ").includes(timespan);
}

priceActionRouter.get("/:timespan/:tickers/:start/:end", async (req, res) => {
	const { tickers, start, end, timespan } = req.params;

	if (isValidTimespan(timespan)) {
		const from = dayjs(start).startOf("day");
		const to = dayjs(end).add(1, "day").startOf("day");

		const tickersArray = tickers.replace(/w/g, "").split(",");

		const rows = await fetchPriceActionForTicker({
			timespan,
			from,
			to,
			tickers: tickersArray,
		});

		res.json({ rows });
	}
});
