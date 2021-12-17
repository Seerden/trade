import { snapshotResponseKeyMap } from "../../constants/response-mapping";
import { OHLCFetchResponse } from "../../types/ohlc.types";

export function snapshotToPriceAction({ results }: OHLCFetchResponse) {
    if (!results.length) return;

    const priceActionRows = results.map((result) =>
        Object.keys(result).reduce((acc, key) => {
            if (!(key in snapshotResponseKeyMap)) {
                return acc;
            } else {
                acc[snapshotResponseKeyMap[key]] = result[key];
                return acc;
            }
        }, {})
    );

    return priceActionRows;
}
