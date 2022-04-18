import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { formatYMD } from "./format-YMD";

/* Market holidays calendar: https://www.nyse.com/markets/hours-calendars
    No point in using a scraper for this, there are fewer than 10 dates per year,
    so it's much quicker to manually write them out  */
const holidays2021 =
	"Jan 1, Jan 18, Feb 15, Apr 2, May 31, Jul 5, Sep 6, Dec 24"
		.split(",")
		.map((date) => dayjs(`2021 ${date}`));

const holidays2022 =
	"Jan 17, Feb 21, Apr 15, May 30, Jun 20, Jul 4, Sep 5, Dec 26"
		.split(",")
		.map((date) => dayjs(`2022 ${date}`));

/**
 * List of US market holidays (days on which the market isn't open at all)
 * @note each of these dates is set to midnight, so we can check if a
 * date is part of this array by setting its time to midnight and comparing
 * its `valueOf()` to those of each holiday
 */
export const marketHolidays = holidays2021.concat(holidays2022);

export /** List of market days (YYYY-MM-DD) in the next few years on which close is at 1.00 PM. */
const halfDays =
	"2023-07-03 2024-07-03 2022-11-25 2023-11-24 2024-11-29 2024-12-24".split(
		" "
	);

export function isEarlyClose(date: DateDayjsOrString) {
	return halfDays.includes(formatYMD(date));
}
