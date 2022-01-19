import { DateDayjsOrString } from "../../../../types/date.types";
import { PermittedTimespan } from "../../get-table-name";
import { PolygonAggregateResults } from "./results.types";

// @dev -- note that these are all admissible timespans. for our purposes, we'll only be using minute, hour, day
export type PolygonTimespan =
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year";

export type PolygonAggregateOptions = {
    ticker: string;
    multiplier: number;
    /*  polygon actually allows more timespans (see PolygonTimespan type above)
        but we don't care for any of those, at least not at this point */
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
