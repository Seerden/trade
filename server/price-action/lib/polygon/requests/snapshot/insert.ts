import format from "pg-format";
import { PriceActionRow } from "types/database.types";
import { PriceActionApiObject } from "../../../../../database/pools/query-objects";
import { objectToArray } from "../../../../../helpers/object-to-array";
import { DateDayjsOrString } from "../../../../../types/date.types";
import {
	priceActionFields,
	priceActionFieldsString,
} from "../../../constants/fields";
import { fetchSnapshot } from "./fetch";
import { snapshotToPriceAction } from "./transform";

/**
 * Insert a polygon daily snapshot into the database.
 * @param priceActionObjects this is the return from `snapshotToPriceAction()`
 */
async function insertSnapshot(priceActionObjects: PriceActionRow[]) {
	if (!priceActionObjects.length) return;

	const priceActionArrays = priceActionObjects.map((object) =>
		objectToArray(object, priceActionFields)
	);

	const text = format(
		"insert into price_action_1d (%s) values %L returning timestamp",
		priceActionFieldsString,
		priceActionArrays
	);

	const queryResponse = await PriceActionApiObject.query({ text });
	return queryResponse;
}

/**
 * Fetch daily OHLCV snapshot for all tickers, convert the response to priceAction
 * rows, then insert these rows into our database.
 */
export async function fetchAndInsertSnapshot(date: DateDayjsOrString) {
	const rawResponse = await fetchSnapshot({ date });

	const priceActionObjects = snapshotToPriceAction(rawResponse);
	if (!priceActionObjects.length) return;

	return await insertSnapshot(priceActionObjects);
}
