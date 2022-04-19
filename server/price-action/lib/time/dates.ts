import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { dateToEODTimestamp } from "../../database/queries/most-active";
import { isActiveMarketDay, isHoliday, isWorkday } from "./check-date";
import { unixMillis } from "./date-manipulation";
import { formatYMD } from "./format-YMD";

/**
 * Create a list of all days in the past two years on which the stock market was
 * open, up to and possibly including today.
 */
export function getAllMarketDaysInPastTwoYears() {
	const today = dayjs().startOf("day");
	const twoYearsAgo = today.add(-2, "year");

	let latest = twoYearsAgo;

	const dates: string[] = [formatYMD(latest)];

	while (latest.valueOf() < today.valueOf()) {
		latest = latest.add(1, "day");

		if (isWorkday(latest) && !isHoliday(latest)) {
			dates.push(formatYMD(latest));
		}
	}

	return dates;
}

// Return true if the dateA occurs on a future day w.r.t dateB. So if dateA and
// dateB are different times on the same day, this returns false.
export function isDayInFuture(
	dateA: DateDayjsOrString | number,
	dateB: DateDayjsOrString | number
) {
	const dateAYMD = formatYMD(dayjs(dateA));
	const dateBYMD = formatYMD(dayjs(dateB));

	return dateAYMD.valueOf() > dateBYMD.valueOf();
}

export function isSameDay(dateA: DateDayjsOrString, dateB: DateDayjsOrString) {
	return formatYMD(dateA) === formatYMD(dateB);
}

/**
 * Get the date corresponding to the nearest (in the past) finished trading
 * session. If date is either (1) a market date, but the session is still
 * active, or (2) not a market date at all, walk back in time until we find
 * another market day.
 */
export function getNearestPastFinishedMarketDay(
	referenceDate?: DateDayjsOrString
): string {
	if (isDayInFuture(referenceDate, new Date())) {
		return getNearestPastFinishedMarketDay(new Date());
	}

	const now = referenceDate || new Date();
	const nowMillis = unixMillis(now);

	// Today's session is over: today is the nearest finished market day.
	if (nowMillis > dateToEODTimestamp(now)) {
		return formatYMD(now);
	}

	// Today's session isn't over: find nearest past non-weekend, non-holiday.
	let date = dayjs(now).add(-1, "day");
	while (!isActiveMarketDay(now)) {
		date = date.add(-1, "day");
	}

	return formatYMD(date);
}
