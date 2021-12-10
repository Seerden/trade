import axios from "axios";
import dayjs from "dayjs";
import type { DateDayjsOrString, DateOrDayjs } from "../../types/date.types";

const baseUrl = "https://query2.finance.yahoo.com";

// query parameters for yahoo!finance v8/finance/chart/TICKER endpoint
type TickerFetchParams = {
    includePrePost?: boolean;
    interval?: string; // e.g. 1m, 5m, 3mo, 5d, ytd, max -- 1m goes back 30 days, 5m goes back few months
    period1?: number; // start of interval. unix timestamp -- get using e.g. new Date().valueOf()/1000
    period2?: number; // end of interval
    events?: string; // e.g. div,split
};

export async function fetchPriceActionForTicker(
    ticker: string,
    start: DateDayjsOrString,
    end: DateDayjsOrString
) {
    /* set up query
        params:
            includePrePost=true
            period1: start of day as unix timestamp
            period2: end of trading day as unix timestamp. use new york time for this. play around with values to see what we need
            is a simple start+1day enough, or do we actually need to use end of after-hours session as period2?
    */

    /*
        @todo:
        - function input will be a date range. 
            manually set the start and end times to start of premarket of first date,
            and end of after-hours of second date. make sure the days are correct        
    */

    const { data } = await axios.get(`${baseUrl}/v8/finance/chart/${ticker}`, {
        params: {
            includePrePost: true,
            period1: dateToTimestamp(start),
            period2: dateToTimestamp(end),
        } as Partial<TickerFetchParams>,
    });

    return data;
}

/**
 * Convert a date to a UNIX timestamp, e.g. for use with yf API
 * Note that the yf API expects a timestamp in seconds, whereas in JS we typically work with milliseconds
 */
function dateToTimestamp(date: DateOrDayjs | string) {
    return dayjs(date).valueOf() / 1000;
}
