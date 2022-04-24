import { PermittedTimespan } from "./polygon/types/aggregate.types";

export const timespanToTableMap: { [k in PermittedTimespan]: string } = {
	minute: "price_action_1m",
	hour: "price_action_1h",
	day: "price_action_1d",
};
