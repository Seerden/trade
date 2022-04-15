import { Job, Queue, QueueEvents, QueueScheduler, Worker } from "bullmq";
import Redis from "ioredis";
import {
	AggregateJobData,
	SnapshotJobData,
} from "../../../../types/queue.types";
import { fetchAndInsertAggregate } from "../../polygon/requests/aggregate/insert";
import { fetchAndInsertSnapshot } from "../../polygon/requests/snapshot/insert";

// BullMQ wants to connect to Redis separately. For now, we'll use the same
// store we use elsewhere, but we might want to create a separate Docker service
// for this eventually.
const connection = new Redis("redis://store:6379", {
	maxRetriesPerRequest: null,
});

export const snapshotQueueName = "polygonSnapshotFetchQueue";

export const snapshotQueue = new Queue(snapshotQueueName, {
	connection,
	defaultJobOptions: {
		removeOnComplete: 10, // keep only the latest 10 snapshots
	},
});

// Scheduler is strictly only necessary if we have a delay or rate limiter, but
// I don't think there are any adverse effect if we initialize it regardless.
// Note that it doesn't have to be .run() or anything, it starts up as soon as
// it's initialized.
const snapshotQueueScheduler = new QueueScheduler(snapshotQueueName, {
	connection,
});

const snapshotQueueEvents = new QueueEvents(snapshotQueueName, {
	connection,
});

snapshotQueueEvents.on("completed", ({ jobId, returnvalue }) => {
	console.log(`Completed job ${jobId}`);

	// Can use this to log the result of the process that was just completed by
	// the worker, but since that's going to be 120k+ rows, let's not. :)
	// console.log({ returnvalue });
});

export const polygonSnapshotFetchWorker = new Worker(
	snapshotQueueName,
	async ({ data, name }: Job<SnapshotJobData | AggregateJobData>) => {
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
