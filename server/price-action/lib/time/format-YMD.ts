import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";

/**
 * Given a date, format to YYYY-MM-DD.
 * @note Doesn't return anything if dayjs deems the date an "Invalid Date"
 */
export function formatYMD(date: DateDayjsOrString): Maybe<string> {
	const formattedDate = dayjs(date).format("YYYY-MM-DD");

	if (!(formattedDate === "Invalid Date")) return formattedDate;
}
