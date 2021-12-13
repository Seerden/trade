/**
 * Parse yfinance response, which contains arrays of e.g. volume, close price,
 * to individual rows, where each entry has one timestamp and the OHLCV information
 * for that time interval.
 *
 * @see documentation/price-action/api/yf.md for information above yf response shape
 */

import { RawYFResponse, YFResponse, YFRow } from "../../../types/api.types";
import { makeYfResponseObject } from "./make-response-object";

const quoteKeys = "open close high low volume timestamp".split(" ");

/**
 * Check whether a yf response `quote` field contains all the information we desire.
 * - quote object needs to have each of open, close, high, low, volume
 * - the above all need to be arrays of equal length
 */
export function isValidYfResponse(response: YFResponse) {
    const uniqueArrayLengths = new Set<number>();
    for (const key of quoteKeys) {
        if (!(key in response)) return false;
        uniqueArrayLengths.add(response[key].length);
    }
    if (!(uniqueArrayLengths.size === 1) || uniqueArrayLengths.has(0)) return false;
    return true;
}

/**
 * check if an object can be considered a valid YFRow
 * - each key (open, high, low, ..) must be non-empty
 * - stock price must be below 1e6
 *      - there are a few tickers (e.g. CEI) for which this doesn't hold,
 *        because of tremendous stock price dilutions,
 *        but those entries aren't interesting anyway, so this is not an issue
 */
function isValidPriceActionObject(row: YFRow) {
    /* check if each row[key] has a value. note that we must explicitly check for 0/"0",
         since we can't predict whether yf API returns numbers as strings or not, and a 
         valid response may actually be 0, like when a ticker didn't trade any volume on a given day  */
    const allKeysHaveValues = Object.keys(row).every(
        (key) => !!row[key] || [0, "0"].includes(row[key])
    );
    const priceWithinLimits = ["high", "low"].every((key) => row[key] < 1e6);
    return allKeysHaveValues && priceWithinLimits;
}

/**
 * Convert a raw yf response, which contains field `quote`, which has arrays of volume, close, etc.,
 *      and field `timestamp`, which is a list of timestamps, to an array of rows, where each entry
 *      has OHLCV+timestamp information for one of the specified time intervals,
 * into a single flattened object with OHLCV+timestamp
 *
 * @todo - implement tests
 */
export function yfResponseToRows(rawResponse: RawYFResponse): Array<YFRow> {
    const response = makeYfResponseObject(rawResponse);
    if (!isValidYfResponse(response)) return;

    const rows: Array<YFRow> = [];
    const { open, high, low, close, volume, timestamp } = response;

    try {
        // grab the i-th entry of each of the above arrays and create a row for each i.
        for (let i = 0; i < open.length; i++) {
            const row: YFRow = {
                open: open[i],
                high: high[i],
                low: low[i],
                close: close[i],
                volume: volume[i],
                timestamp: timestamp[i],
            };

            if (isValidPriceActionObject(row)) {
                rows.push(row);
            }
        }
        return rows;
    } catch (error) {
        console.error(error);
        return [];
    }
}
