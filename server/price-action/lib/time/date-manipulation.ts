import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Datelike } from "../../../types/date.types";
import { newYorkLocale } from "../constants/time";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Convert a date to a UNIX timestamp, e.g. for use with yf API
 * Note that the yf API expects a timestamp in seconds, whereas in JS we
 * typically work with milliseconds.
 */
export function dateToTimestampSeconds(date: Datelike) {
	return dayjs(date).valueOf() / 1000;
}

/**
 * Take a date and convert it to US market time (i.e. New York local time) as a
 * string. To get something usable as New York time, we have to convert to a
 * string, otherwise dayjs will, with most methods, end up using the host
 * machine's locale again.
 */
export function toNewYorkTime(date: Datelike, format = "YYYY-MM-DD HH:mm:ss") {
	return dayjs(date).tz(newYorkLocale).format(format);
}

/** Convert date to UNIX timestamp in milliseconds. */
export function unixMillis(date: Datelike) {
	return dayjs(date).valueOf();
}
