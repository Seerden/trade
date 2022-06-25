import { captureMessage } from "@sentry/node";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import format from "pg-format";
import { PriceAPI } from "../../../database/pools/apis";
import { PriceActionRow } from "../../../types/database.types";
import { Datelike } from "../../../types/date.types";
import { isValidTimespan } from "../../../types/guards/is-valid-timespan";
import { timespanToTableMap } from "../../lib/get-table-name";
import { PermittedTimespan } from "../../lib/polygon/types/aggregate.types";
import { formatYMD } from "../../lib/time/format-YMD";
import { isEarlyClose } from "../../lib/time/market-holidays";

dayjs.extend(utc);
dayjs.extend(tz);

/**
 * Convert a date to a timestamp corresponding to the market close of that day.
 * Doesn't account for non-trading days, but does recognize half-days.
 */
export function dateToEODTimestamp(date: Datelike) {
	const ymdDate = formatYMD(date);

	const closeTime = isEarlyClose(date) ? "13:00" : "16:00";

	const timestamp = dayjs(
		dayjs.tz(`${ymdDate} ${closeTime}`, "America/New_York")
	).valueOf();
	return timestamp;
}

/** Construct the query text for getDailyMostActive(). */
function constructDailyMostActiveQuery(
	date: Datelike,
	timespan: PermittedTimespan = "day",
	tickerCount = 300
) {
	if (isValidTimespan(timespan)) {
		const table = timespanToTableMap[timespan];

		const text = format(
			`
            select * from %s 
            where timestamp = %L
            order by volume desc
            limit %L
         `,
			table,
			dateToEODTimestamp(date),
			tickerCount
		);

		return text;
	}
}

export async function getDailyMostActive({
	date,
	timespan = "day",
	tickerCount = 300,
}: {
	date: Datelike;
	timespan?: PermittedTimespan;
	tickerCount?: number;
}) {
	const text = constructDailyMostActiveQuery(date, timespan, tickerCount);
	try {
		return (await PriceAPI.query({
			text,
		})) as Array<PriceActionRow>;
	} catch (error) {
		captureMessage(`Error fetching most active ticker data for ${date}`, {
			extra: {
				text,
				error,
			},
		});
	}
}
