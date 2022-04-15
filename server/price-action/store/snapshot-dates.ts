import { redisClient } from "../../store/redis-client";
import { DateDayjsOrString } from "../../types/date.types";
import { formatYMD } from "../lib/time/format-YMD";

const redisSnapshotDatesKey = "snapshot:dates";

/** Redis: get list of dates for which Polygon snapshots have already been saved. */
async function getSnapshotDates() {
	return await redisClient.smembers(redisSnapshotDatesKey);
}

/**
 * Redis: check if a snapshot was already saved (0: no, 1: yes) for the given
 * date.
 */
async function isSavedSnapshotDate(date: DateDayjsOrString) {
	return await redisClient.sismember(redisSnapshotDatesKey, formatYMD(date));
}

/**
 * Redis: add a date to list of saved Polygon snapshot dates.
 * @returns 0 if already included or not added for some reason, 1 if added
 * successfully.
 * */
async function addSnapshotDate(date: DateDayjsOrString) {
	await redisClient.sadd(redisSnapshotDatesKey, formatYMD(date));
}

/** Bulk add dates to `snapshot:dates`. */
async function bulkAddSnapshotDates(dates: DateDayjsOrString[]) {
	const pipeline = redisClient.pipeline();

	const ymdDates = dates.map((date) => formatYMD(date));

	if (ymdDates.some((date) => !date)) return; // TODO: send Sentry message.

	for (const date of ymdDates) {
		pipeline.sadd(redisSnapshotDatesKey, date);
	}

	return await pipeline.exec();
}

/**
 * Redis: remove a date from list of saved Polygon snapshot dates.
 * @returns 0 if date wasn't in the set, 1 if date was successfully removed.
 */
async function removeSnapshotDate(date: DateDayjsOrString) {
	await redisClient.srem(redisSnapshotDatesKey, formatYMD(date));
}

/** Redis: delete entire `snapshot:dates` set. */
async function removeAllSnapshotDates() {
	await redisClient.del(redisSnapshotDatesKey);
}

export const snapshotStore = {
	get: getSnapshotDates,
	exists: isSavedSnapshotDate,
	add: addSnapshotDate,
	bulkAdd: bulkAddSnapshotDates,
	remove: removeSnapshotDate,
	__DELETE: removeAllSnapshotDates,
};
