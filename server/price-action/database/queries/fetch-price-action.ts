import format from "pg-format";
import { PermittedTimespan } from "price-action/lib/polygon/types/aggregate.types";
import { PriceActionApiObject } from "../../../database/pools/query-objects";
import { DateDayjsOrString } from "../../../types/date.types";
import { timescaleToTableName } from "../../lib/get-table-name";
import { unixMillis } from "../../lib/time/date-manipulation";

type Options = {
	timescale: PermittedTimespan;
	ticker: string;
	from: DateDayjsOrString;
	to: DateDayjsOrString;
	limit?: string | number;
};

/** Fetch price action for one ticker for a given date range and timescale. */
export async function fetchPriceActionForTicker({
	timescale,
	ticker,
	from,
	to,
	limit = "750",
}: Options) {
	const text = format(
		"select * from %I where ticker = '%s' and timestamp between %L and %L limit %L",
		timescaleToTableName(timescale),
		ticker.toUpperCase(),
		unixMillis(from),
		unixMillis(to),
		limit
	);

	// TODO: do not include `ticker` field in response.
	return await PriceActionApiObject.query({ text });
}
