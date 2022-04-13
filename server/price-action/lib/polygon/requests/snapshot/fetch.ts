import { formatYMD } from "../../../time/format-YMD";
import { axiosPolygon } from "../../axios-instance";
import { OHLCFetchOptions, OHLCFetchResponse } from "../../types/ohlc.types";

/**
 * Fetch daily OHLCV for all tickers. Note that we're on a free plan, so we can
 * only fetch data for a given date if that date's trading session has fully ended.
 *
 * @usage Only use inside fetchAndInsertSnapshot. If used elsewhere, make sure
 * to first check if snapshot already exists.
 */
export async function fetchSnapshot({ date, adjusted }: OHLCFetchOptions) {
	const formattedDate = formatYMD(date);
	const url = `/v2/aggs/grouped/locale/us/market/stocks/${formattedDate}`;
	const { data } = await axiosPolygon.get<OHLCFetchResponse>(url);
	return data;
}
