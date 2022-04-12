import { snapshotResponseKeyMap } from "../../constants/polygon-response-maps";
import { OHLCFetchResponse, SnapshotResult } from "../../types/ohlc.types";

// @todo: deal with types here. Consider doing something other than acc[snapshotResponseKeyMap[key]] = result[key]
export function snapshotToPriceAction({ results }: OHLCFetchResponse): Array<unknown> {
	if (!results.length) return [];

	const priceActionRows = results.map((result) =>
		Object.keys(result).reduce((acc, key: keyof SnapshotResult) => {
			if (!(key in snapshotResponseKeyMap)) return acc;

			// @ts-ignore: deal with this later
			acc[snapshotResponseKeyMap[key]] = result[key];
			return acc;
		}, {})
	);

	return priceActionRows;
}
