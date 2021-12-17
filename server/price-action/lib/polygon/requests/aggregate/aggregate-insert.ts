/* 
    Insert a number of PriceActionRow objects into the database
*/

import format from "pg-format";
import { makePooledQuery } from "../../../../database/pool/query-functions";
import { PolygonAggregateOptions, PolygonTimespan } from "../../types/aggregate.types";
import { fetchTickerAggregate } from "./aggregate-ticker";
import { aggregateToPriceActionObjects } from "./aggregate-to-rows";

/**
 * Fetch price aggregate for a ticker and insert OHLCV values into database
 */
export async function fetchAndInsertAggregate({
    timespan,
    ticker,
    from,
    to,
}: {
    timespan: PolygonAggregateOptions["timespan"];
    ticker: string;
    from: PolygonAggregateOptions["from"];
    to: PolygonAggregateOptions["to"];
}) {
    const rawResponse = await fetchTickerAggregate({
        ticker,
        from,
        to,
        timespan,
        multiplier: 1,
    });

    // convert priceActionObjects to arrays for multi-insert with pg-promise
    const rowsForDatabase = aggregateToPriceActionObjects(rawResponse).map((row) => {
        // make sure columns are in the same order as the columns in our query (see format() call below)
        const columns = "ticker, timestamp, open, close, high, low, volume".split(", ");

        return columns.map((column) => row[column]);
    });

    // get table name that matches timespan argument
    const tableName: { [K in PolygonTimespan]: string } = {
        minute: "price_action_1m",
        hour: "price_action_1h",
        day: "price_action_1d",
    }[timespan];

    return await makePooledQuery({
        text: format(
            `insert into %I (ticker, timestamp, open, close, high, low, volume) values %L returning (timestamp)`,
            tableName,
            rowsForDatabase
        ),
    });
}
