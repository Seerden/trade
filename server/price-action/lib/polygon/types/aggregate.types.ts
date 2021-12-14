import { DateDayjsOrString } from "../../../../types/date.types";
import { Results } from "./results.types";

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
    timespan: PolygonTimespan;
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
    results: Results;
};
