import { Datelike } from "../../../../types/date.types";
import { PolygonAggregateResults } from "./results.types";

/** @note We'll probably only be using 'minute', 'hour' and 'day'. */
export type PolygonTimespan =
	| "minute"
	| "hour"
	| "day"
	| "week"
	| "month"
	| "quarter"
	| "year";

/** @note As mentioned, most valid timespans aren't relevant for us, for now. */
export type PermittedTimespan = "minute" | "hour" | "day";

export type PolygonAggregateOptions = {
	/** The ticker symbol of the stock/equity. */
	ticker: string;
	/** The size of the timespan multiplier. */
	multiplier: number;
	/** The size of the time window. */
	timespan: PermittedTimespan;
	/** The start of the aggregate time window. */
	from: Datelike;
	/** The end of the aggregate time window. */
	to: Datelike;
	/** Whether or not the results are adjusted for splits. By default, results are adjusted. Set this to false to get results that are NOT adjusted for splits.  */
	adjusted?: boolean;
	/** Sort the results by timestamp. asc will return results in ascending order (oldest at the top), desc will return results in descending order (newest at the top). */
	sort?: "asc" | "desc";
	/** Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000. */
	limit?: number;
};

export type PolygonAggregateResponse = {
	ticker: string;
	adjusted: boolean;
	queryCount: number;
	request_id: string;
	resultsCount: number;
	status: string;
	results: PolygonAggregateResults;
};
