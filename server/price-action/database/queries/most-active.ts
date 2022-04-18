import { captureMessage } from "@sentry/node";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import format from "pg-format";
import { PriceActionApiObject } from "../../../database/pools/query-objects";
import { DateDayjsOrString } from "../../../types/date.types";
import { formatYMD } from "../../lib/time/format-YMD";
import { isEarlyClose } from "../../lib/time/market-holidays";

dayjs.extend(utc);
dayjs.extend(tz);

/**
 * Convert a date to a timestamp corresponding to the market close of that day.
 * Doesn't account for non-trading days, but does recognize half-days.
 */
export function dateToEODTimestamp(date: DateDayjsOrString) {
	const ymdDate = formatYMD(date);

	const closeTime = isEarlyClose(date) ? "13:00" : "16:00";

	const timestamp = dayjs(
		dayjs.tz(`${ymdDate} ${closeTime}`, "America/New_York")
	).valueOf();
	return timestamp;
}

/** Construct the query text for getDailyMostActive(). */
function constructDailyMostActiveQuery(
	date: DateDayjsOrString,
	tickerCount = 300
) {
	const text = format(
		`
      select * from price_action_1d 
      where timestamp = %L
      order by volume desc
      limit %L
      `,
		dateToEODTimestamp(date),
		tickerCount
	);

	return text;
}

export async function getDailyMostActive({
	date,
	tickerCount = 300,
}: {
	date: DateDayjsOrString;
	tickerCount?: number;
}) {
	const text = constructDailyMostActiveQuery(date, tickerCount);
	try {
		return await PriceActionApiObject.query({
			text,
		});
	} catch (error) {
		captureMessage(`Error fetching most active ticker data for ${date}`, {
			extra: {
				text,
				error,
			},
		});
	}
}
