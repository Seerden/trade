import format from "pg-format";
import { PriceActionResponse } from "../../../types/db.types";
import { makePooledQuery } from "../pool/query-functions";

export async function fetchDailyPriceAction(ticker: string): Promise<
    Array<{
        open: string;
        high: string;
        low: string;
        close: string;
        volume: number;
        timestamp: string;
    }>
> {
    // @todo check if ticker is a valid ticker by comparing it to our list of tickers
    // @todo check if table exists

    const tableName = `${ticker}_1d`;

    /*
        might be better to return lists of timestamps, volumes, etc, just like yf api does it.
        should compare to see JSON size.

        should convert the numeric columns to floats, maybe? round them to 4 decimals, pray that js number handling
        is good enough to not mess up randomly...
    
    */
    return await makePooledQuery({
        text: format(
            "select open, close, high, low, volume, timestamp from %I",
            tableName
        ),
    });
}

/**
 * Reshape the raw database response returned by fetchDailyPriceAction
 * into something more compact. We're essentially reshaping the response
 * into the return shape of the yf api.
 * - raw:
 *      Array<{open, high, ...}>
 * - desired:
 *      {
 *          open: [],
 *          high: [],
 *          ...
 *      }
 */
export async function fetchFlatDailyAction(ticker: string) {
    const rows = await fetchDailyPriceAction(ticker);

    const baseResponse: PriceActionResponse & { ticker: string } = {
        open: [],
        high: [],
        low: [],
        close: [],
        volume: [],
        timestamp: [],
        ticker,
    };

    const response = rows.reduce((acc, cur) => {
        for (const [key, val] of Object.entries(cur)) {
            acc[key].push(val);
        }
        return acc;
    }, baseResponse);

    return response;
}
