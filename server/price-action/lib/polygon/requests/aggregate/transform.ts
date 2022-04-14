/** Goal: convert raw response from aggregate API endpoint to objects we can use for database insertion. */

import { PriceActionRow } from "../../../../../types/database.types";
import { priceActionFields } from "../../../constants/fields";
import { aggregateResponseKeyMap } from "../../constants/polygon-response-maps";
import { PolygonAggregateResponse } from "../../types/aggregate.types";
import { PolygonAggregateResult } from "../../types/results.types";

/** Take a price action row and set its ticker property to an uppercase ticker. */
function withTicker(row: PriceActionRow, ticker: string) {
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

			if (priceActionFields.includes(mappedKey)) {
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
	const { results, ticker } = response;
	return results.map((result) =>
		mapAggregateResultToPriceAction(result, ticker)
	);
}
