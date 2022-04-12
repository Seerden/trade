/** Goal: convert raw response from aggregate API endpoint to objects we can use for database insertion. */

import { PriceActionRow } from "../../../../../types/database.types";
import {
	aggregateResponseKeyMap,
	priceActionColumns,
} from "../../constants/polygon-response-maps";
import { PolygonAggregateResponse } from "../../types/aggregate.types";
import { PolygonAggregateResult } from "../../types/results.types";

/**
 * Check, key-by-key, whether a polygon /aggregate response has the shape we expect it to have
 * @todo move this somewhere else, like a /validation folder
 */
export function isValidResponse(response: PolygonAggregateResponse): boolean {
	/* @todo: write functionality to verify that we receive a response shape from poly API,
        in case they ever decide to change their API responses */
	return response && true;
}

/** Take a price action row and set its ticker property to an uppercase ticker. */
function withTicker(row: PriceActionRow, ticker: string) {
	if (row.ticker) return row;

	// eslint-disable-next-line no-param-reassign
	row.ticker = ticker.toUpperCase();
	return row;
}

/** Map one PolygonAggregateResult to a PriceActionRow. */
function mapAggregateResultToPriceAction(
	result: PolygonAggregateResult,
	ticker: string
) {
	const res: PriceActionRow = Object.keys(result).reduce(
		(acc, key: keyof typeof aggregateResponseKeyMap) => {
			const mappedKey = aggregateResponseKeyMap[key] as keyof PriceActionRow;

			if (priceActionColumns.includes(mappedKey)) {
				const value = result[key];

				(acc[mappedKey] as string | number) = value;
				return acc;
			}

			return acc;
		},
		{} as PriceActionRow
	);

	return withTicker(res, ticker);
}

/** Transform a raw polygon /aggregate response to `PriceActionRow`s. */
export function aggregateToPriceActionObjects(
	response: PolygonAggregateResponse
): Array<PriceActionRow> {
	if (!isValidResponse(response)) return [];

	const { results, ticker } = response;
	return results.map((result) =>
		mapAggregateResultToPriceAction(result, ticker)
	);
}

export type valueof<T> = T[keyof T];
