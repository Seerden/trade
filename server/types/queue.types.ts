import { fetchAndInsertAggregate } from "../price-action/lib/polygon/requests/aggregate/insert";
import { DateDayjsOrString } from "./date.types";

export type SnapshotJobData = {
	date: DateDayjsOrString;
};

export type AggregateJobData = Parameters<typeof fetchAndInsertAggregate>[0];
