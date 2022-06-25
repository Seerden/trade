import dayjs from "dayjs";
import { Datelike } from "../../../types/date.types";
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

// Return true if the dateA occurs on a future day as dateB. So if dateA and
// dateB are different times on the same day, this returns false.
export function isDayInFuture(
	dateA: Datelike | number,
	dateB: Datelike | number
) {
	const dateAYMD = formatYMD(dayjs(dateA));
	const dateBYMD = formatYMD(dayjs(dateB));

	return dateAYMD.valueOf() > dateBYMD.valueOf();
}

/**
 * Return true is dateA and dateB are YMD-formattable and dateA and dateB occur
 * on the same calendar day.
 */
export function isSameDay(dateA: Datelike, dateB: Datelike) {
	const [formattedA, formattedB] = [formatYMD(dateA), formatYMD(dateB)];
	return formattedA && formattedB && formattedA === formattedB;
}
