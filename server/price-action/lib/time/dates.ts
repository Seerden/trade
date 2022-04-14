import dayjs, { Dayjs } from "dayjs";
import { isHoliday, isWorkday } from "./check-date";
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
