import { captureMessage } from "@sentry/node";
import { JobType } from "bullmq";
import { Router } from "express";
import {
	listPolygonQueueJobs,
	polygonQueue,
} from "../../price-action/lib/queue/polygon-queue";
import { addSnapshotFetchJobs } from "../../price-action/lib/queue/snapshot/add-fetch-job";
import { formatYMD } from "../../price-action/lib/time/format-YMD";

export const queueRouter = Router({ mergeParams: true });

/** Check whether `jobType` is one of the job types we care about. */
function isPermittedJobType(jobType: string): jobType is JobType {
	// The following are only a subset of all possible JobTypes actually, but we
	// don't currently care about any other ones.
	return "active completed stalled failed delayed".split(" ").includes(jobType);
}

/** Get all jobs tagged 'delayed' from polygonQueue. */
queueRouter.get("/polygon/jobs/count/:jobType", async (req, res) => {
	const { jobType } = req.params;

	if (!isPermittedJobType(jobType)) {
		return res.json({
			message: "Invalid value specified for parameter :jobType",
		});
	}

	res.json({
		[`${jobType}jobCount`]: await polygonQueue.getJobCountByTypes(jobType),
	});
});

/** Fetch counts and data for a few types of jobs. */
queueRouter.get("/polygon/jobs", async (req, res) => {
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
