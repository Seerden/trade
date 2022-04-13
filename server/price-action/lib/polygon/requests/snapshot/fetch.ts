import dayjs from "dayjs";
import { axiosPolygon } from "../../axios-instance";
import { OHLCFetchOptions, OHLCFetchResponse } from "../../types/ohlc.types";

/**
 * Fetch daily OHLCV for all tickers. Note that we're on a free plan, so we can
 * only fetch data for a given date if that date's trading session has fully ended.
 */
export async function fetchSnapshot({ date, adjusted }: OHLCFetchOptions) {
	const formattedDate = dayjs(date).format("YYYY-MM-DD");
	const url = `/v2/aggs/grouped/locale/us/market/stocks/${formattedDate}`;
	const { data } = await axiosPolygon.get<OHLCFetchResponse>(url);
	return data;
}
