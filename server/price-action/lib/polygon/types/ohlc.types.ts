import { Datelike } from "../../../../types/date.types";
import { SnapshotResults } from "./results.types";

export type OHLCFetchOptions = {
	adjusted?: boolean;
	date: Datelike;
};

/** @see https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date */
export type OHLCFetchResponse = {
	queryCount: number;
	resultsCount: number;
	adjusted: boolean;
	results: SnapshotResults;
	status: string;
	request_id: string;
	count: number;
};

export type OHLC =
	| "ticker"
	| "timestamp"
	| "open"
	| "high"
	| "low"
	| "close"
	| "volume";
