import { Router } from "express";
import {
	listPolygonQueueJobs,
	polygonQueue,
} from "../../price-action/lib/queue/polygon-queue";

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
