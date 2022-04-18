import format from "pg-format";
import { DateDayjsOrString } from "../../../types/date.types";
import { dateToEODTimestamp } from "./most-active";

export function makeDailyMoversQuery(
	date: DateDayjsOrString,
	tickerCount = 300
) {
	const timestamp = dateToEODTimestamp(date);

	const text = format(
		`
      select * from price_action_1m
      where timestamp = %L
      order by (high-low)/low desc
      limit %L
   `,
		timestamp,
		tickerCount
	);

	return text;
}
