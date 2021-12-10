/*  We want to fetch price action after every trading session. 
    Goal: Programmatically derive the next point in time at which data needs to be fetched.
    Need:
        - check whether today is a trading day (don't need to fetch on weekends, holidays)
        - if there is a current trading session active, find out for how much longer it's active, and
            delay fetching until session is complete (maybe allow for some padding in case yf doesn't
            update API instantly)
        - if the session is already over, but data for the session wasn't fetched yet: fetch immediately

    Store various data related to fetching in redis (we want to know things like
        { 
            fetchType: "daily active", 
            lastFetchTime: -timestamp-
        }
    )
*/

import { redisClient } from "../../store/redis-client";
import { DateDayjsOrString } from "../../types/date.types";
import { isHoliday, isWeekday } from "./time/check-date";

/**
 * Want to store lastOneMinuteFetch, lastFiveMinuteFetch, etc. in a redis list of some kind
 * This function then gets the last fetch date for a given time interval (ideally, we'd fetch all intervals)
 * at the same time, or at least sequentially, but you never know, so just check individually
 */
async function getLastFetchDate(): Promise<number> {
    const key = "";
    return +(await redisClient.get(key));
}

/**
 * Check whether a date (`date` be set to any time of day) is an active market day
 */
export function isActiveMarketDay(date: DateDayjsOrString) {
    return isWeekday(date) && !isHoliday(date);
}
