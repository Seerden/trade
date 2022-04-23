import express from "express";
import {
	fetchExistingSnapshotDates,
	fetchExistingSnapshotTimestamps,
} from "../../price-action/store/snapshot-reconcile";

export const snapshotRouter = express.Router({ mergeParams: true });

snapshotRouter.get("/dates", async (req, res) => {
	res.json({ dates: await fetchExistingSnapshotDates() });
});

snapshotRouter.get("/timestamps", async (req, res) => {
	res.json({ timestamps: await fetchExistingSnapshotTimestamps() });
});
