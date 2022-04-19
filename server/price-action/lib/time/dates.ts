import dayjs, { Dayjs } from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { dateToEODTimestamp } from "../../database/queries/most-active";
import { isActiveMarketDay, isHoliday, isWorkday } from "./check-date";
import { formatYMD } from "./format-YMD";

// get list of all market days in the past two years
export function getAllMarketDaysInPastTwoYears() {
	const today = dayjs().startOf("day");
	const twoYearsAgo = today.add(-2, "year");

	let latest = twoYearsAgo;

	const dates: Dayjs[] = [latest];

	while (latest.valueOf() < today.valueOf()) {
		latest = latest.add(1, "day");

		if (isWorkday(latest) && !isHoliday(latest)) {
			dates.push(latest);
		}
	}

	return dates.map((date) => formatYMD(date));
}

/**
 * Get the date corresponding to the nearest (in the past) finished trading
 * session. If date is either (1) a market date, but the session is still
 * active, or (2) not a market date at all, walk back in time until we find
 * another market day.
 */
export function getNearestPastFinishedMarketDay(
	date: DateDayjsOrString = new Date()
) {
	const initialDate = dayjs(date);
	const initialTimestamp = initialDate.valueOf();
	const eodTimestamp = dateToEODTimestamp(initialDate);
	const eodToday = dateToEODTimestamp(new Date());

	// Handle case where given a future date.
	if (initialTimestamp > eodToday) {
		// If trading session has ended, return today.
		if (!(eodToday > new Date().valueOf())) {
			return formatYMD(new Date());
		}
		// Handle case where we're passed a timestamp on a trading day that's
		// already ended.
	} else if (initialTimestamp > eodTimestamp) {
		return formatYMD(initialDate);
	}

	let currentDate = dayjs(initialDate).add(-1, "day");
	while (
		// if date not market date, keep walking back
		!isActiveMarketDay(currentDate) ||
		// if date is after today, keep walking back
		dayjs(formatYMD(currentDate)).valueOf() >
			dayjs(formatYMD(new Date())).valueOf() ||
		// if date is today and today's session not ended, keep walking back
		(formatYMD(currentDate) === formatYMD(new Date()) &&
			currentDate.valueOf() < dateToEODTimestamp(currentDate))
	) {
		currentDate = currentDate.add(-1, "day");
	}

	return formatYMD(currentDate);
}
