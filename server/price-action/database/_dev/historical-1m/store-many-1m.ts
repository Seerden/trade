import { storeFetchedDateRange } from "../../../store/store-fetched-dates";
import { insertHistoricalOneMinuteAction } from "../../statements/insert-1m-data";
import { makeTickerArray } from "../tickers/make-tickers-array";
import { delay } from "../wait";

export async function initManyOneMinute() {
    const [start, end] = ["2021 Dec 6", "2021 Dec 10"];
    try {
        for (const ticker of (await makeTickerArray()).slice(1500, 2000)) {
            console.log(`inserting 1m data for ${ticker}`);
            await insertHistoricalOneMinuteAction(ticker, start, end);
            await storeFetchedDateRange({ ticker, timescale: "1d", start, end });
            delay(20);
        }
    } catch (error) {
        console.error(error);
    }
}
