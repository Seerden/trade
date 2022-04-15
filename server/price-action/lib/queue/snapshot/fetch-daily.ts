import { Job, Queue, QueueEvents, QueueScheduler, Worker } from "bullmq";
import dayjs from "dayjs";
import Redis from "ioredis";
import { fetchAndInsertSnapshot } from "../../polygon/requests/snapshot/insert";

// BullMQ wants to connect to Redis separately. For now, we'll use the same
// store we use elsewhere, but we might want to create a separate Docker service
// for this eventually.
const connection = new Redis("redis://store:6379", {
	maxRetriesPerRequest: null,
});

export const queueName = "dailySnapshot";

export const repeatQueue = new Queue(queueName, {
	connection,
	defaultJobOptions: {
		removeOnComplete: 10,
	},
});

const queueScheduler = new QueueScheduler(queueName, {
	connection,
});

const queueEvents = new QueueEvents(queueName, {
	connection,
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
	console.log({
		jobId,
		message: "Fetched daily Polygon snapshot.",
	});
});

export const fetchWorker = new Worker(
	queueName,
	async ({ data }: Job<{ date: string }>) => {
		// Get yesterday's date. Since this function is supposed to run at ~1am,
		// this represents the date of the most recent market session.
		const dateToFetchFor = dayjs(new Date()).add(-1, "day");
		await fetchAndInsertSnapshot(dateToFetchFor);
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

export async function addJob() {
	const job = await repeatQueue.add(
		"delay",
		{},
		{
			repeat: {
				cron: "0 1 * * *", // 1am every day,
				offset: new Date().getTimezoneOffset(),
				tz: "Europe/Amsterdam",
			},
		}
	);

	return job;
}
