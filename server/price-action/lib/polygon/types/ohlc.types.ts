import { DateDayjsOrString } from "../../../../types/date.types";
import { PolygonAggregateResults } from "./results.types";
export type OHLCFetchOptions = {
    adjusted?: boolean;
    date: DateDayjsOrString;
};

// see https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
export type OHLCFetchResponse = {
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results: PolygonAggregateResults;
    status: string;
    request_id: string;
    count: number;
};
