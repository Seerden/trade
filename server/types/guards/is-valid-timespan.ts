import { PermittedTimespan } from "../../price-action/lib/polygon/types/aggregate.types";

export function isValidTimespan(
	timespan: string
): timespan is PermittedTimespan {
	return "day, hour, minute".split(", ").includes(timespan);
}
