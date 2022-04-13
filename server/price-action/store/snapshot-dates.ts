import { redisClient } from "../../store/redis-client";
import { DateDayjsOrString } from "../../types/date.types";
import { formatYMD } from "../lib/time/format-YMD";

const redisSnapshotDatesKey = "snapshot:dates";

/** Redis: get list of dates for which Polygon snapshots have already been saved. */
export async function getSnapshotDates() {
	return await redisClient.sMembers(redisSnapshotDatesKey);
}

/**
 * Redis: check if a snapshot was already saved (0: no, 1: yes) for the given
 * date.
 */
export async function isSavedSnapshotDate(date: DateDayjsOrString) {
	await redisClient.sIsMember(redisSnapshotDatesKey, formatYMD(date));
}

/**
 * Redis: add a date to list of saved Polygon snapshot dates.
 * @returns 0 if already included or not added for some reason, 1 if added
 * successfully.
 * */
export async function addSnapshotDate(date: DateDayjsOrString) {
	await redisClient.sAdd(redisSnapshotDatesKey, formatYMD(date));
}

/**
 * Redis: remove a date from list of saved Polygon snapshot dates.
 * @returns 0 if date wasn't in the set, 1 if date was successfully removed.
 */
export async function removeSnapshotDate(date: DateDayjsOrString) {
	await redisClient.sRem(redisSnapshotDatesKey, formatYMD(date));
}
