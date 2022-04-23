import { captureMessage } from "@sentry/node";
import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { isActiveMarketDay } from "./check-date";
import { formatYMD } from "./format-YMD";

/**
 * Given `start`, find the date `n-1` market days after `start`.
 * Given `end`, find the date `n-1` market days before `end`.
 *
 * @usage polygon API response may contain at most 50k rows per query.
 * Since we know how many rows can exist in a day (e.g. for 1-minute bars,
 * there's 16*60=960 bars per day), we can efficiently maximize the query
 * endpoints, by calculating the exact date at which we get these 50k rows
 *
 * @return start and end dates formatted as YYYY-MM-DD. We choose this since
 * we expect to only use this function as polygon query
 * param, and polygon expects dates formatted like this.
 */
export function nMarketDayRange({
	n,
	start,
	end,
}: {
	n: number;
	start?: DateDayjsOrString;
	end?: DateDayjsOrString;
}): string[] | undefined {
	if (n === 0) return;

	// Can't specify both start and end, so use `start` if both are specified.
	const endpoint = dayjs(start || end);

	if (n === 1) return [formatYMD(endpoint)];

	/* if `end` specified, we want to walk back, so need to add -1 days per step,
        hence need sign === -1 */
	const sign = start ? 1 : -1;

	let runningDateCount = isActiveMarketDay(endpoint) ? 1 : 0;
	let nextDate = endpoint;

	// Walk (backwards or forwards) n-1 days
	while (runningDateCount < n) {
		nextDate = nextDate.add(sign * 1, "day");
		if (isActiveMarketDay(nextDate)) {
			runningDateCount += 1;
		}
	}

	const range = start ? [start, nextDate] : [nextDate, end];
	return range.map((date) => formatYMD(date));
}

/** Given a `start` and `end` date, list all market days in date interval [`start`, `end`]. */
export function listMarketDaysInRange(
	start: DateDayjsOrString,
	end: DateDayjsOrString
) {
	if (dayjs(formatYMD(end)).valueOf() <= dayjs(formatYMD(start)).valueOf()) {
		captureMessage("listMarketDaysInRange: provided end <= start.");
		return;
	}

	const dates = [];

	let currentDate = dayjs(start).startOf("day");

	while (currentDate <= dayjs(end).startOf("day")) {
		if (isActiveMarketDay(currentDate)) {
			dates.push(formatYMD(currentDate));
		}

		currentDate = currentDate.add(1, "day");
	}

	return dates;
}
