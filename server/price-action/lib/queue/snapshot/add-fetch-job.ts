import { DateDayjsOrString } from "../../../../types/date.types";
import { formatYMD } from "../../time/format-YMD";
import { polygonQueue, snapshotFetchQueueName } from "./snapshot-queue";

/**
 * Add a list of `dates` to the Bull queue for which we want to fetch Polygon
 * daily snapshots.
 *
 * @note Note that adding a date that already exists is fine, as long
 * as our fetcher function properly recognizes that the date has already been
 * fetched, and returns (but doesn't throw!) some semantic value based on this fact.
 */
export async function addSnapshotFetchJobs(dates: DateDayjsOrString[]) {
	const formattedDates = dates.map((date) => formatYMD(date));

	if (formattedDates.some((date) => !date)) return;

	const bulkObjects = formattedDates.map((date) => ({
		name: snapshotFetchQueueName,
		data: { date },
	}));

	const addedJobs = await polygonQueue.addBulk(bulkObjects);

	return { addedJobs };
}
