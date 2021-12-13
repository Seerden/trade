/**
 * Parse yfinance response, which contains arrays of e.g. volume, close price,
 * to individual rows, where each entry has one timestamp and the OHLCV information
 * for that time interval.
 *
 * See documentation/price-action/api/yf.md for information above yf response shape
 *
 * @todo: think about whether or not the ticker needs to be included in each row
 *
 */

import { RawYFResponse, YFResponse, YFRow } from "../../../types/api.types";
import { makeYfResponseObject } from "./make-response-object";

const quoteKeys = "open close high low volume".split(" ");

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
 * Convert a raw yf response, which contains field `quote`, which has arrays of volume, close, etc.,
 *      and field `timestamp`, which is a list of timestamps, to an array of rows, where each entry
 *      has OHLCV+timestamp information for one of the specified time intervals,
 * into a single flattened object with OHLCV+timestamp
 *
 * @todo - implement tests
 */
export function yfResponseToRows(rawResponse: RawYFResponse) {
    const response = makeYfResponseObject(rawResponse);
    if (!isValidYfResponse(response)) return;

    const rows: Array<YFRow> = [];
    const { open, high, low, close, volume, timestamp } = response;
    /* grab the i-th entry of each of the above arrays and create a row for each i.
        On first glance, doesn't seem to me like there's a declarative array index 
        method for this. Straightforward loop is fastes anyway. */
    for (let i = 0; i < open.length; i++) {
        const row: YFRow = {
            open: open[i],
            high: high[i],
            low: low[i],
            close: close[i],
            volume: volume[i],
            timestamp: timestamp[i],
        };
        if (
            Object.keys(row).every((key) => !!row[key] || [0, "0"].includes(row[key])) &&
            ["high", "low"].every((key) => row[key] < 1e6)
        ) {
            rows.push(row);
        }
    }
    return rows;
}
