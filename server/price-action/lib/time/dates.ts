import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { isHoliday, isWorkday } from "./check-date";
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
