import { formatYMD } from "../../../time/format-YMD";
import { axiosPolygon } from "../../axios-instance";
import {
	PolygonAggregateOptions,
	PolygonAggregateResponse,
} from "../../types/aggregate.types";

interface AggregateUrlOptions {
	ticker: string;
	multiplier: string | number;
	timespan: string;
	from: string;
	to: string;
}

/** Build URL to use for a Polygon.io aggregate GET request. */
function getAggregateUrl({
	ticker,
	multiplier,
	timespan,
	from,
	to,
}: AggregateUrlOptions) {
	const url = `/v2/aggs/ticker/${ticker.toUpperCase()}/range/${multiplier}/${timespan}/${from}/${to}`;
	return url;
}

/**
 * Fetch aggregate data for a ticker in a given time-range. Note that using a date like
 * '2022-01-15' will include all data until the end of that day's trading session.
 */
export async function fetchTickerAggregate({
	ticker,
	multiplier,
	timespan,
	from,
	to,
	sort = "asc",
	limit = 50000,
}: PolygonAggregateOptions) {
	const [fromString, toString] = [from, to].map((date) => formatYMD(date));
	const url = getAggregateUrl({
		ticker,
		multiplier,
		timespan,
		from: fromString,
		to: toString,
	});
	const { data } = await axiosPolygon.get<PolygonAggregateResponse>(url, {
		params: { limit, sort },
	});
	return data;
}
