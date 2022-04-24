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
 * The reconciliation can be implemented as follows (TODO: WIP):
 * - map existing timestamps (fetchExistingSnapshotTimestamps) to dates
 * - compare dates to market-active days from the past two years
 * - if we're missing data for any market days, queue a job to fetch that data
 *
 * @todo: Run reconciliation on startup.
 */

import { PriceAPI } from "../../database/pools/apis";
import { formatYMD } from "../lib/time/format-YMD";

export async function fetchExistingSnapshotTimestamps() {
	const [{ timestamps }] = await PriceAPI.query<[{ timestamps: string[] }]>({
		// Since the snapshot endpoint returns a snapshot of _every_ ticker for a
		// given date, all we have to do is find a ticker that's always present
		// and return all existing timestamps for that ticker. Much faster than
		// querying everything.
		text: "select array_agg(timestamp) timestamps from price_action_1d where ticker='SPY'",
	});

	return timestamps;
}

export async function fetchExistingSnapshotDates() {
	const timestamps = await fetchExistingSnapshotTimestamps();

	return Array.from(new Set(timestamps.map((t) => formatYMD(new Date(t)))));
}

export async function getMissingSnapshotDates() {
	// TODO: get a list of dates from past two years on which market was open, but for
	// which we don't have snapshot data yet.
}
