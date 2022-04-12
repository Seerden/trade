import { DateDayjsOrString } from "../../../../types/date.types";
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
	ticker: string;
	multiplier: number;
	timespan: PermittedTimespan;
	from: DateDayjsOrString;
	to: DateDayjsOrString;
	adjusted?: boolean;
	sort?: "asc" | "desc";
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
