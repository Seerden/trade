/**
 * In development, databases might not always be in sync.
 *
 * Since we only update key/value pairs when fetching from a given instance, we
 * might end up with out-of-sync data between database and redis store. Take for
 * example the case where we use a database backup from one machine on another
 * machine. The redis store on the 'other machine' then doesn't know about the
 * newly changed data. To make sure we don't subsequently accidentally attempt
 * to fetch data we already have, we reconcile store state with database state
 * on startup.
 *
 * @todo: Run reconciliation on startup.
 */

import { PriceActionApiObject } from "../../database/pools/query-objects";

export async function fetchExistingSnapshotTimestamps() {
	const rows = await PriceActionApiObject.query({
		// Since the snapshot endpoint returns a snapshot of _every_ ticker for a
		// given date, all we have to do is find a ticker that's always present
		// and return all existing timestamps for that ticker. Much faster than
		// querying everything.
		text: "select jsonb_agg(timestamp) timestamps from price_action_1d where ticker='SPY'",
	});

	return rows;
}
