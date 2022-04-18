import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { formatYMD } from "./format-YMD";
import { marketHolidays } from "./market-holidays";

/** Check if a date is a workday (workdays are Monday through Friday). */
export function isWorkday(date: DateDayjsOrString) {
	const dayOfWeek = dayjs(date).day();
	return dayOfWeek > 0 && dayOfWeek < 6;
}

/** Check whether a date (date can be at any time throughout the day) is a market holiday. */
export function isHoliday(date: DateDayjsOrString) {
	return marketHolidays.includes(formatYMD(date));
}

/**
 * Check whether a date (`date` can be set to any time of day) is an active market
 * day. Returns `false` on weekends and market holidays.
 */
export function isActiveMarketDay(date: DateDayjsOrString) {
	return isWorkday(date) && !isHoliday(date);
}
