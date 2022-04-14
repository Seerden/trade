import { PriceActionRow } from "types/database.types";
import type { valueof } from "../../../../../types/valueof";
import { snapshotResponseKeyMap as keyMap } from "../../constants/polygon-response-maps";
import { OHLCFetchResponse } from "../../types/ohlc.types";
import { SnapshotResult } from "../../types/results.types";

export function snapshotToPriceAction({ results }: OHLCFetchResponse) {
	if (!results?.length) return [];

	const priceActionRows = results.map((result) =>
		Object.keys(result).reduce(
			(priceActionRow, oldKey: keyof SnapshotResult) => {
				if (!(oldKey in keyMap)) return priceActionRow;

				const newKey: keyof PriceActionRow = keyMap[
					oldKey
				] as keyof PriceActionRow;

				(priceActionRow[newKey] as valueof<PriceActionRow>) = result[oldKey];

				return priceActionRow;
			},
			{} as PriceActionRow
		)
	);

	return priceActionRows;
}
