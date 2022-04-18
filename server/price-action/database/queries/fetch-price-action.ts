import format from "pg-format";
import { PermittedTimespan } from "price-action/lib/polygon/types/aggregate.types";
import { PriceActionApiObject } from "../../../database/pools/query-objects";
import { DateDayjsOrString } from "../../../types/date.types";
import { timespanToTableMap } from "../../lib/get-table-name";
import { unixMillis } from "../../lib/time/date-manipulation";

type Options = {
	timespan: PermittedTimespan;
	tickers: string[];
	from: DateDayjsOrString;
	to: DateDayjsOrString;
	limit?: string | number;
};

/** Fetch price action for one ticker for a given date range and timescale. */
export async function fetchPriceActionForTicker({
	timespan,
	tickers,
	from,
	to,
	limit = "5000",
}: Options) {
	const text = format(
		// Note: https://stackoverflow.com/a/67687175
		// jsonb_agg only takes a single parameter. So have to do jsonb_agg(to_jsonb(...))
		`
         select ticker, jsonb_agg(to_jsonb(p) - 'ticker') rows 
         from %I p 
         where ticker in (%L) 
         and timestamp between %L and %L 
         group by ticker
      `,
		timespanToTableMap[timespan],
		tickers.map((t) => t.toUpperCase()),
		unixMillis(from),
		unixMillis(to),
		limit
	);

	// TODO: do not include `ticker` field in response.
	return await PriceActionApiObject.query({ text });
}
