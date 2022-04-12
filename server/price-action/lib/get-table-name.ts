import { PermittedTimespan } from "./polygon/types/aggregate.types";

export function timescaleToTableName(timespan: PermittedTimespan) {
	const tableName: string = {
		minute: "price_action_1m",
		hour: "price_action_1h",
		day: "price_action_1d",
	}[timespan];

	return tableName;
}
