import { DateDayjsOrString } from "../../../../types/date.types";
import { PolygonAggregateResult } from "./results.types";

export type OHLCFetchOptions = {
    adjusted?: boolean;
    date: DateDayjsOrString;
};

export interface SnapshotResult extends PolygonAggregateResult {
    T: string;
}

// see https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
export type OHLCFetchResponse = {
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results: Array<SnapshotResult>;
    status: string;
    request_id: string;
    count: number;
};
