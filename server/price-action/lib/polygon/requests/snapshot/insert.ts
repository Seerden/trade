import { objectToArray } from "helpers/object-to-array";
import format from "pg-format";
import { PriceActionRow } from "types/database.types";
import { PriceActionApiObject } from "../../../../../database/pools/query-objects";
import { DateDayjsOrString } from "../../../../../types/date.types";
import { fetchDailyOHLC } from "./fetch";
import { snapshotToPriceAction } from "./transform";

// TODO: these can be in a /constants file - just make sure to refine variable
// names first.
const fieldsString = "ticker, timestamp, open, close, high, low, volume";
const fields = fieldsString.split(", ") as Array<keyof PriceActionRow>;

/**
 * Fetch daily OHLCV snapshot for all tickers, convert the response to priceAction
 * rows, then insert these rows into our database.
 */
export async function fetchAndInsertSnapshot({
	date,
}: {
	date: DateDayjsOrString;
}) {
	const rawResponse = await fetchDailyOHLC({ date });

	const priceActionObjects = snapshotToPriceAction(rawResponse);

	if (!priceActionObjects.length) return;

	const priceActionObjectsAsArrays = priceActionObjects.map((object) =>
		objectToArray(object, fields)
	);

	const text = format(
		"insert into price_action_1d (%s) values %L returning timestamp",
		fieldsString,
		priceActionObjectsAsArrays
	);

	return PriceActionApiObject.query({ text });
}
