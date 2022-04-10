import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

type DateDayjsOrString = Date | Dayjs | string;

/**
 * Take a date and convert it to US market time (i.e. New York local time) as a string
 * To get something usable as New York time, we have to convert to a string, otherwis dayjs will,
 * with most methods, end up using the host machine's locale again.
 */
export function toNewYorkTime(
	date: DateDayjsOrString,
	format = "YYYY-MM-DD HH:mm:ss"
) {
	return dayjs(date).tz("America/New_York").format(format);
}
