import dayjs from "dayjs";
import polygon from "../../axios-instance";
import { OHLCFetchOptions, OHLCFetchResponse } from "../../types/ohlc.types";

/**
 * Fetch daily OHLCV for all tickers. Note that we're on a free plan, so we can
 * only fetch data for a given date if that date's trading session is fully ended.
 */
export async function fetchDailyOHLC({ date }: OHLCFetchOptions) {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const url = `/v2/aggs/grouped/locale/us/market/stocks/${formattedDate}`;
    const { data } = await polygon.get(url);
    return data as OHLCFetchResponse;
}