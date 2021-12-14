import dayjs from "dayjs";
import polygon from "../axios-instance";
import {
    PolygonAggregateOptions,
    PolygonAggregateResponse,
} from "../types/aggregate.types";

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
    const url = `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${fromString}/${toString}`;
    const { data } = await polygon.get(url, { params: { limit, sort } });
    return data as PolygonAggregateResponse;
}
