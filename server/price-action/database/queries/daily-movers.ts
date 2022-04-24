import format from "pg-format";
import { PriceAPI } from "../../../database/pools/apis";
import { DateDayjsOrString } from "../../../types/date.types";
import { dateToEODTimestamp } from "./most-active";

/**
 * Construct a database query to fetch the biggest gainers or losers on a given
 * date.
 */
function makeDailyMoversQuery(
	date: DateDayjsOrString,
	tickerCount = 300,
	type: "gainers" | "losers" = "gainers"
) {
	const timestamp = dateToEODTimestamp(date);

	const sortDirection = type === "gainers" ? "desc" : "asc";

	const text = format(
		`
      select * from price_action_1d
      where timestamp = %L
      order by (high-low)/low %s
      limit %s
   `,
		timestamp,
		sortDirection,
		tickerCount
	);

	return text;
}

export async function fetchDailyMovers(
	...options: Parameters<typeof makeDailyMoversQuery>
) {
	const rows = await PriceAPI.query({
		text: makeDailyMoversQuery(...options),
	});

	return rows;
}
