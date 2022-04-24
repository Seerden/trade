import { captureMessage } from "@sentry/node";
import { Router } from "express";
import {
	listPolygonQueueJobs,
	polygonQueue,
} from "../../price-action/lib/queue/polygon-queue";
import { addSnapshotFetchJobs } from "../../price-action/lib/queue/snapshot/add-fetch-job";
import { formatYMD } from "../../price-action/lib/time/format-YMD";

export const queueRouter = Router({ mergeParams: true });

/** Get all jobs tagged 'delayed' from polygonQueue. */
queueRouter.get("/queue/polygon/jobs/count/delayed", async (req, res) => {
	res.json({
		delayedJobCount: await polygonQueue.getJobCountByTypes("delayed"),
	});
});

/** Fetch counts and data for a few types of jobs. */
queueRouter.get("/queue/polygon/jobs", async (req, res) => {
	res.json({ jobs: await listPolygonQueueJobs() });
});

/** Get data for the job matching `jobId` */
queueRouter.get("/polygon/job/:id", async (req, res) => {
	const jobId = req.params.id;
	const job = await polygonQueue.getJob(jobId);

	if (!job) {
		res.json({ message: `No job found with id ${jobId}` });
	} else {
		res.json({ job });
	}
});

/**
 * Manually add a snapshot fetch job to the queue.
 * @todo Check whether or not the snapshot for this date was already fetched.
 */
queueRouter.post("/snapshot/:date", async (req, res) => {
	const formattedDate = formatYMD(req.params.date);

	if (!formattedDate) {
		captureMessage("Invalid date specified", {
			extra: {
				endpoint: "/q/snapshot:date",
				params: req.params,
			},
		});

		return res.json({
			message: "Specified date parameter could not be parsed to YYYY-MM-DD",
		});
	}

	res.json({ addedJobs: await addSnapshotFetchJobs([formattedDate]) });
});
