import dayjs from "dayjs";
import { axiosPolygon } from "../../axios-instance";
import {
	PolygonAggregateOptions,
	PolygonAggregateResponse,
} from "../../types/aggregate.types";

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
	const [fromString, toString] = [from, to].map((date) =>
		dayjs(date).format("YYYY-MM-DD")
	);
	const url = `/v2/aggs/ticker/${ticker.toUpperCase()}/range/${multiplier}/${timespan}/${fromString}/${toString}`;
	const { data } = await axiosPolygon.get<PolygonAggregateResponse>(url, {
		params: { limit, sort },
	});
	return data;
}
