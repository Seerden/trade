import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";

/** Given a date, format to YYYY-MM-DD. */
export function formatYMD(date: DateDayjsOrString) {
	const formattedDate = dayjs(date).format("YYYY-MM-DD");

	if (!(formattedDate === "Invalid Date")) return formattedDate;
}
