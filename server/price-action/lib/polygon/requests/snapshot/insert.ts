import format from "pg-format";
import { PriceActionRow } from "types/database.types";
import { PriceAPI } from "../../../../../database/pools/apis";
import { objectToArray } from "../../../../../helpers/object-to-array";
import { Datelike } from "../../../../../types/date.types";
import { snapshotStore } from "../../../../store/snapshot-dates";
import {
	priceActionFields,
	priceActionFieldsString,
} from "../../../constants/fields";
import { fetchSnapshotWithLimiter } from "./fetch";
import { snapshotToPriceAction } from "./transform";

const insertConflictSnippet = format(`
   on conflict (ticker, timestamp)
   do update
   set
      open = excluded.open,
      high = excluded.high,
      low = excluded.low,
      close = excluded.close,
      volume = excluded.volume
`);

/**
 * Insert a polygon daily snapshot into the database.
 * @param priceActionObjects this is the return from `snapshotToPriceAction()`
 */
async function insertSnapshot(priceActionObjects: PriceActionRow[]) {
	if (!priceActionObjects?.length) return;

	const priceActionArrays = priceActionObjects.map((object) =>
		objectToArray(object, priceActionFields)
	);

	const text = format(
		`with inserted_rows as (
         insert into price_action_1d (%s) values %L 
         ${insertConflictSnippet}
         returning timestamp
      ) 
      select distinct timestamp
      from inserted_rows
      limit 10
      `,
		priceActionFieldsString,
		priceActionArrays
	);

	const response = await PriceAPI.query({ text });
	return response;
}

/**
 * Fetch daily OHLCV snapshot for all tickers, convert the response to priceAction
 * rows, then insert these rows into our database.
 */
export async function fetchAndInsertSnapshot(date: Datelike) {
	// Check if snapshot was already fetched previously.
	if (await snapshotStore.exists(date)) return;

	const rawResponse = await fetchSnapshotWithLimiter({ date });

	const priceActionObjects = snapshotToPriceAction(rawResponse);
	if (!priceActionObjects.length) return;

	const timestamps = await insertSnapshot(priceActionObjects);

	if (timestamps) {
		await snapshotStore.add(date);
		return timestamps;
	}

	return "Failed to add to snapshotStore";
}
