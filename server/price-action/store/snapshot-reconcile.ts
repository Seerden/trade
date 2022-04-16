/**
 * In development, databases might not always be in sync.
 *
 * Since we only update key/value pairs when fetching from a given instance, we
 * might end up with out-of-sync data between database and redis store. Take for
 * example the case where we use a database backup from one machine, on another
 * machine. The redis store on the 'other machine' then doesn't know about the
 * newly changed data.
 */

import { PriceActionApiObject } from "../../database/pools/query-objects";

export async function fetchExistingSnapshotTimestamps() {
	const rows = await PriceActionApiObject.query({
		// text: "select jsonb_agg(distinct timestamp) timestamps from price_action_1d",
		text: "select jsonb_agg(timestamp) timestamps from price_action_1d where ticker='SPY'",
	});

	return rows;
}
