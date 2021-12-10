import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";

/**
 * Convert a date to a UNIX timestamp, e.g. for use with yf API
 * Note that the yf API expects a timestamp in seconds, whereas in JS we typically work with milliseconds
 */
export function dateToTimestamp(date: DateDayjsOrString) {
    return dayjs(date).valueOf() / 1000;
}
