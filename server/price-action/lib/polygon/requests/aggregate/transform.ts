/** Goal: convert raw response from aggregate API endpoint to objects we can use for database insertion. */

import { PriceActionRow } from "../../../../../types/database.types";
import { valueof } from "../../../../../types/valueof";
import { priceActionFields } from "../../../constants/fields";
import { aggregateResponseKeyMap as keyMap } from "../../constants/polygon-response-maps";
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
		(priceActionRow, oldKey: keyof typeof keyMap) => {
			const newKey = keyMap[oldKey] as keyof PriceActionRow;

			if (!priceActionFields.includes(newKey)) return priceActionRow;

			(priceActionRow[newKey] as valueof<PriceActionRow>) = result[oldKey];

			return priceActionRow;
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
