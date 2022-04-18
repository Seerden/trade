import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";

/**
 * Convert date to UNIX timestamp in milliseconds
 */
export function unixMillis(date: DateDayjsOrString) {
	return dayjs(date).valueOf();
}
