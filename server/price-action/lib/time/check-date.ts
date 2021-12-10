import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { marketHolidays } from "./market-holidays";

export function isWeekday(date: DateDayjsOrString) {
    const dayOfWeek = dayjs(date).day();
    return dayOfWeek > 0 && dayOfWeek < 6;
}

/**
 * Check whether a date (date can be at any time throughout the day) is a market holiday
 */
export function isHoliday(date: DateDayjsOrString) {
    const startOfDay = dayjs(date).startOf("day");
    const indexInholidays = marketHolidays.findIndex(
        (x) => x.valueOf() == startOfDay.valueOf()
    );
    return typeof indexInholidays === "number" && indexInholidays >= 0;
}

/**
 * Check whether a date (`date` be set to any time of day) is an active market day
 */
export function isActiveMarketDay(date: DateDayjsOrString) {
    return isWeekday(date) && !isHoliday(date);
}
