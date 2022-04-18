import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";

/** Format a given `date` to YYYY-MM-DD. */
export function formatYMD(date: DateDayjsOrString) {
	const formattedDate = dayjs(date).format("YYYY-MM-DD");

	if (!(formattedDate === "Invalid Date")) return formattedDate;
}
