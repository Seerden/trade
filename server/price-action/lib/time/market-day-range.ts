import dayjs, { Dayjs } from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { isActiveMarketDay } from "./check-date";

/**
 * Given `start`, find the date `n-1` market days after `start`.
 * Given `end`, find the date `n-1` market days before `end`.
 *
 * @usage polygon API response may contain at most 50k rows per query.
 * Since we know how many rows can exist in a day (e.g. for 1-minute bars, there's 16*60=960 bars per day),
 * we can efficiently maximize the query endpoints, by calculating the exact date at which we get these 50k rows
 *
 * @return start and end dates formatted as YYYY-MM-DD. We choose this since we expect to only use this function as polygon query
 * param, and polygon expects dates formatted like this.
 */
export function nMarketDayRange({
    n,
    start,
    end,
}: {
    n: number;
    start?: DateDayjsOrString;
    end?: DateDayjsOrString;
}) {
    if (n === 0) return;

    const givenEndpoint = start || end; // can't specify both start and end, so use `start` if both are specified
    const endpointStartOfDay = dayjs(givenEndpoint).startOf("day");

    if (n === 1) return [endpointStartOfDay.format("YYYY-MM-DD")];

    const sign = start ? 1 : -1; // if `end` specified, we want to walk back, so need to add -1 days per step, hence need sign === -1

    let numMarketDaysInInterval = isActiveMarketDay(endpointStartOfDay) ? 1 : 0;
    let otherIntervalEndpoint: Dayjs = endpointStartOfDay;

    // walk (backwards or forwards) n-1 days
    while (numMarketDaysInInterval < n) {
        otherIntervalEndpoint = otherIntervalEndpoint.add(sign * 1, "day");
        if (isActiveMarketDay(otherIntervalEndpoint)) {
            numMarketDaysInInterval++;
        }
    }

    const range = start ? [start, otherIntervalEndpoint] : [otherIntervalEndpoint, end];
    return range.map((date) => dayjs(date).format("YYYY-MM-DD"));
}
