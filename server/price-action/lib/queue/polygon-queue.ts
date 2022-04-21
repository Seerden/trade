import { captureMessage } from "@sentry/node";
import { Job, Queue, QueueEvents, QueueScheduler, Worker } from "bullmq";
import Redis from "ioredis";
import {
	AggregateJobData,
	MaxAggregateJobData,
	SnapshotJobData,
} from "../../../types/queue.types";
import { fetchAndInsertMaxOneMinuteData } from "../../database/_dev/polygon/max-1m-query";
import { fetchAndInsertAggregate } from "../polygon/requests/aggregate/insert";
import { fetchAndInsertSnapshot } from "../polygon/requests/snapshot/insert";

// BullMQ wants to connect to Redis separately. For now, we'll use the same
// store we use elsewhere, but we might want to create a separate Docker service
// for this eventually.
const connection = new Redis("redis://store:6379", {
	maxRetriesPerRequest: null,
});

export const polygonQueueName = "polygonSnapshotFetchQueue";

export const polygonQueue = new Queue(polygonQueueName, {
	connection,
	defaultJobOptions: {
		removeOnComplete: 10, // keep only the latest 10 snapshots
		removeOnFail: false,
	},
});

// Scheduler is strictly only necessary if we have a delay or rate limiter, but
// I don't think there are any adverse effect if we initialize it regardless.
// Note that it doesn't have to be .run() or anything, it starts up as soon as
// it's initialized.
const polygonQueueScheduler = new QueueScheduler(polygonQueueName, {
	connection,
	stalledInterval: 20 * 1000,
});

const polygonQueueEvents = new QueueEvents(polygonQueueName, {
	connection,
});

polygonQueueEvents.on("completed", ({ jobId, returnvalue }) => {
	console.log(`Completed job ${jobId} at ${new Date().toLocaleString()}`);
});

polygonQueueEvents.on("failed", ({ jobId, failedReason, prev }) => {
	captureMessage("Failed job", { extra: { jobId, failedReason, prev } });
});

polygonQueueEvents.on("stalled", async (_) => {
	captureMessage("Stalled job", {
		extra: { ..._, job: await polygonQueue.getJob(_.jobId) },
	});
});

export const polygonSnapshotFetchWorker = new Worker(
	polygonQueueName,
	async ({
		data,
		name,
	}: Job<SnapshotJobData | AggregateJobData | MaxAggregateJobData>) => {
		if (name === "aggregate") {
			try {
				const response = await fetchAndInsertAggregate(
					data as AggregateJobData
				);
				return response;
			} catch (error) {
				return error;
			}
		}

		if (name === "snapshot") {
			const response = await fetchAndInsertSnapshot(
				(data as SnapshotJobData).date
			);

			if (!response?.status) {
				if (Array.isArray(response)) {
					return response[0];
				}
			} else {
				return response.status;
			}
		}

		if (name === "aggregate-backlog") {
			try {
				return await fetchAndInsertMaxOneMinuteData(
					data as MaxAggregateJobData
				);
			} catch (error) {
				return captureMessage("Error queueing aggregate-backlog job", {
					extra: {
						data,
						error,
					},
				});
			}
		}
	},
	{
		connection,
		limiter: {
			max: 5,
			duration: 60 * 1000,
		},
		autorun: true,
	}
);

export async function listPolygonQueueJobs() {
	return {
		jobs: await polygonQueue.getJobs(),
		failed: await polygonQueue.getFailed(),
	};
}
