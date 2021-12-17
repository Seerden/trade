/*
    Goal: convert raw response from aggregate API endpoint to objects we can use for database insertion
*/

import { PriceActionRow } from "../../../../../types/database.types";
import {
    aggregateResponseKeyMap,
    priceActionColumns,
} from "../../constants/response-mapping";
import { PolygonAggregateResponse } from "../../types/aggregate.types";
import { PolygonAggregateResult } from "../../types/results.types";

/**
 * Check, key-by-key, whether a polygon /aggregate response has the shape we expect it to have
 * @todo move this somewhere else, like a /validation folder
 */
export function isValidResponse(response: PolygonAggregateResponse): boolean {
    /* @todo: write functionality to verify that we receive a response shape from poly API,
        in case they ever decide to change their API responses */
    return true;
}

/**
 * Transform a raw polygon /aggregate response to `PriceActionRow`s
 */
export function aggregateToPriceActionObjects(
    response: PolygonAggregateResponse
): Array<PriceActionRow> {
    if (!isValidResponse(response)) return;

    const { results, ticker } = response;
    return results.map((result) => mapAggregateResultToPriceAction(result, ticker));
}

/**
 * Map one PolygonAggregateResult to a PriceActionRow
 */
function mapAggregateResultToPriceAction(result: PolygonAggregateResult, ticker: string) {
    const res: PriceActionRow = Object.keys(result).reduce((acc, key) => {
        const mappedKey: string = aggregateResponseKeyMap[key];

        if (priceActionColumns.includes(mappedKey)) {
            acc[mappedKey] = result[key];
            return acc;
        }

        return acc;
    }, {} as PriceActionRow);

    return withTicker(res, ticker);
}

/**
 * Take a price action row and add a ticker property with a value
 */
function withTicker(row: PriceActionRow, ticker: string) {
    row.ticker = ticker.toUpperCase();
    return row;
}
