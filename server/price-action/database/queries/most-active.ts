// fetch 300 most active tickers for a given data from the _1d database

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
 * Doesn't account for weekends and holidays, just gets us a timestamp for 4PM
 * on that day.
 */
function dateToEODTimestamp(date: DateDayjsOrString) {
	const ymdDate = formatYMD(date);

	const closeTime = isEarlyClose(date) ? "13:00" : "16:00";

	// Using dayjs.tz(date, timezone) actually gets us the time for that date
	// in that timezone. Doing something like dayjs(date).tz(timezone) doesn't
	// do the same thing.

	// dayjs(date).valueOf() === dayjs(date).tz(timezone).valueOf(),
	// whereas dayjs(date).valueOf() !== dayjs.tz(date, timezone) (unless
	// 'timezone' matches the machine's timezone).

	// So, to be clear: the below statement actually gets us the timestamp for market close.
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
	try {
		return await PriceActionApiObject.query({
			text: constructDailyMostActiveQuery(date, tickerCount),
		});
	} catch (error) {
		console.error(error);
	}
}
