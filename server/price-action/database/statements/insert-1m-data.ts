import format from "pg-format";
import { YFRow } from "../../../types/api.types";
import { DateDayjsOrString } from "../../../types/date.types";
import { fetchPriceActionForTicker } from "../../lib/yf/fetch-price-action/fetch-ticker-history";
import { yfResponseToRows } from "../../lib/yf/parse-yf/quote-to-row";
import { makePooledQuery } from "../pool/query-functions";

const columns = "ticker timestamp open close high low volume".split(" ");

export async function batchInsertOneMinuteRows(
    ticker: string,
    rowsToInsert: Array<YFRow>
) {
    const rowsArray = rowsToInsert.map((row) =>
        columns.map((column) => {
            if (column === "ticker") {
                return ticker;
            }
            return row[column];
        })
    );
    if (!rowsArray.length) return;

    try {
        return await makePooledQuery({
            text: format(
                `
                    insert into price_action_1m (ticker, timestamp, open, close, high, low, volume) values %L
                    on conflict do nothing;
                `,
                rowsArray
            ),
        });
    } catch (error) {
        console.error(error);
    }
}

export async function insertHistoricalOneMinuteAction(
    ticker: string,
    start: DateDayjsOrString,
    end: DateDayjsOrString
) {
    try {
        const rawResponse = await fetchPriceActionForTicker(
            ticker,
            start,
            end,
            "1m",
            true
        );
        const rowsForDatabase = yfResponseToRows(rawResponse);
        if (rowsForDatabase?.length) {
            await batchInsertOneMinuteRows(ticker, rowsForDatabase);
        }
    } catch (error) {
        console.error(error);
        console.log(`error inserting batch one minute rows for ticker ${ticker}`);
    }
}
