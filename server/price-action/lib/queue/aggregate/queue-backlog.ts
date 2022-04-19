import { readFile } from "fs/promises";
import { polygonQueue } from "../polygon-queue";

/** Take a list of tickers and `to` dates and queue a job for each entry. */
export async function queueAggregateBacklog() {
	const rawJson = await readFile("data/aggregate-tuples-to-fetch.json", {
		encoding: "utf-8",
	});
	const parsedJson: Record<string, string[]> = JSON.parse(rawJson);

	console.log(Object.keys(parsedJson));

	const bulkJobs = [];
	for (const [ticker, dates] of Object.entries(parsedJson)) {
		for (const date of dates) {
			const jobData = {
				name: "aggregate-backlog",
				data: { ticker, to: date },
			};

			bulkJobs.push(jobData);
		}
	}

	return await polygonQueue.addBulk(bulkJobs);
}
