import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";

/**
 * Convert date to UNIX timestamp in milliseconds
 */
export function asMillisecondUnixTimestamp(date: DateDayjsOrString) {
    return dayjs(date).unix() * 1000;
}
