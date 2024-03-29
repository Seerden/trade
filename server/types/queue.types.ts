import { fetchAndInsertMaxOneMinuteData } from "../price-action/database/_dev/polygon/max-1m-query";
import { fetchAndInsertAggregate } from "../price-action/lib/polygon/requests/aggregate/insert";
import { DateDayjsOrString } from "./date.types";

export type SnapshotJobData = {
	date: DateDayjsOrString;
};

export type AggregateJobData = Parameters<typeof fetchAndInsertAggregate>[0];

export type MaxAggregateJobData = Parameters<
	typeof fetchAndInsertMaxOneMinuteData
>[0];
