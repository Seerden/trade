import axios from "axios";
import format from "pg-format";
import { RawYFResponse } from "../../../types/api.types";
import type { DateDayjsOrString } from "../../../types/date.types";
import { makePooledQuery } from "../../database/pool/query-functions";
import { yFinanceBaseUrl } from "../constants/urls";
import { dateToTimestamp } from "../time/date-manipulation";

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
    end: DateDayjsOrString,
    /* @todo: consider writing out all admissible intervals -- 
        these are included in each YF response so should be easy to copy-paste
    */
    interval: string = "1m",
    includePrePost = false
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

    const { data } = await axios.get(`${yFinanceBaseUrl}/v8/finance/chart/${ticker}`, {
        params: {
            includePrePost,
            interval,
            period1: dateToTimestamp(start),
            period2: dateToTimestamp(end),
        } as Partial<TickerFetchParams>,
    });

    return data;
}

export async function fetchTenYearDailyPriceAction(
    ticker: string
): Promise<RawYFResponse> {
    const { data } = await axios.get(`${yFinanceBaseUrl}/v8/finance/chart/${ticker}`, {
        params: {
            interval: "1d",
            range: "10y",
        },
    });
    return data;
}

export async function fetchDailyPriceAction(ticker: string) {
    /* @todo: first check if table exists (using our redis store) -- but first, make sure we update redis store on
        successful row insert */
    const tableName = `${ticker}_1d`;

    /* @todo: each returned row will have ticker column. might be more efficient to return each row without the ticker,
         and to include the ticker once, in a separate column, or not at all (API endpoint already knows ticker, 
        so we can include it from there 
        
        - also might be better to return lists of timestamps, volumes, etc, just like yf api does it.
            should compare to see JSON size.

        - also should convert the numeric columns to floats, maybe? round them to 4 decimals, pray that js number handling
        is good enough to not mess up randomly...
        
        */
    return await makePooledQuery({
        text: format("select * from %I", tableName),
    });
}
