import {
    maybeAddTableToSet,
    tickerTableExists,
} from "../../../store/ticker-table-exists";
import { insertTenYearDailyPriceAction } from "../../statements/insert-ten-year-data";
import { delay } from "../wait";

export async function insertManyTenYearDaily(tickers: string[]) {
    try {
        for (const ticker of tickers) {
            if (await tickerTableExists(ticker, "1d")) continue;
            await insertTenYearDailyPriceAction(ticker.toLowerCase());
            /* we're allowed to make a yf API request every 3600/2000 = 1.8 seconds */

            // @todo: consider including the following line inside insertTenYearDailyPriceAction
            await maybeAddTableToSet(ticker, "1d");
            await delay(1800);
        }

        return tickers;
    } catch (error) {
        console.error(error);
    }
}
