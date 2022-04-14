import { Job, Queue, QueueEvents, QueueScheduler, Worker } from "bullmq";
import Redis from "ioredis";
import { fetchSnapshotWithLimiter } from "../../polygon/requests/snapshot/fetch";

const connection = new Redis("redis://store:6379", {
	maxRetriesPerRequest: null,
});

export const snapshotFetchQueueName = "polygonSnapshotFetchQueue";

export const polygonQueue = new Queue(snapshotFetchQueueName, {
	connection,
	defaultJobOptions: {
		removeOnComplete: true,
	},
});

// Scheduler is strictly only necessary if we have a delay or rate limiter, but
// I don't think there are any adverse effect if we initialize it regardless.
// Note that it doesn't have to be .run() or anything, it starts up as soon as
// it's initialized.
const polygonQueueScheduler = new QueueScheduler(snapshotFetchQueueName, {
	connection,
});

const snapshotQueueEvents = new QueueEvents(snapshotFetchQueueName, {
	connection,
});
snapshotQueueEvents.on("completed", ({ jobId, returnvalue }) => {
	console.log(`Completed job ${jobId}`);
	// Can use this to log the result of the process that was just completed by
	// the worker, but since that's going to be 120k+ rows, let's not. :)
	// console.log({ returnvalue });
});

export const polygonSnapshotFetchWorker = new Worker(
	snapshotFetchQueueName,
	async ({ data }: Job<{ date: string }>) =>
		await fetchSnapshotWithLimiter({ date: data.date }),
	{
		connection,
		limiter: {
			max: 5,
			duration: 60 * 1000,
		},
		autorun: false,
	}
);
