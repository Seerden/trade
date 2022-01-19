/* Insert a number of PriceActionRow objects into the database */

import format from "pg-format";
import { Timescale } from "../../../../../types/store.types";
import { makePooledQuery } from "../../../../database/pool/query-functions";
import { storeFetchedDateRange } from "../../../../store/store-fetched-dates";
import { PermittedTimespan, timescaleToTableName } from "../../../get-table-name";
import { PolygonAggregateOptions } from "../../types/aggregate.types";
import { OHLC } from "../../types/ohlc.types";
import { fetchTickerAggregate } from "./aggregate-fetch";
import { aggregateToPriceActionObjects } from "./aggregate-to-rows";

/**
 * Map a timespan like 'minute' to a timescale/interval like '1m'
 */
function timespanToTimescale(timespan: PermittedTimespan): Timescale {
    const mapping: { [K in PermittedTimespan]: Timescale } = {
        minute: "1m",
        hour: "1h",
        day: "1d",
    };

    return mapping[timespan];
}

export function priceActionObjectsToDatabaseRows(
    priceActionObjects: ReturnType<typeof aggregateToPriceActionObjects>
) {
    const rowsForDatabase = priceActionObjects.map((row) => {
        /* make sure columns are in the same order as the columns in our query 
            (see format() call in fetchAndInsertAggregate) */
        const columns = "ticker, timestamp, open, close, high, low, volume".split(
            ", "
        ) as Array<OHLC>;
        return columns.map((column) => row[column]);
    });

    return rowsForDatabase;
}

type InsertArgs = {
    rowsForDatabase: ReturnType<typeof aggregateToPriceActionObjects>;
    options: Pick<PolygonAggregateOptions, "ticker" | "from" | "to" | "timespan">;
};

/**
 * Take an array of aggregate rows (presumably parsed from an aggregate fetch using
 * aggregateToPriceActionObjects, but could also be a manually constructed array),
 * and save the rows to table price_action_<1m|1h|1d>
 */
export async function insertAggregateIntoDatabase(
    rowsForDatabase: InsertArgs["rowsForDatabase"],
    { ticker, from, to, timespan }: InsertArgs["options"]
) {
    const timestampsInserted: Array<{ timestamp: string | number }> =
        await makePooledQuery({
            text: format(
                "insert into %I (ticker, timestamp, open, close, high, low, volume) values %L returning (timestamp)",
                timescaleToTableName(timespan),
                rowsForDatabase
            ),
        });

    if (timestampsInserted.length) {
        return storeFetchedDateRange({
            ticker,
            timescale: timespanToTimescale(timespan),
            start: from,
            end: to,
        });
    }

    return [];
}

/**
 * - fetch price aggregate for a ticker
 * - insert OHLCV values into database
 * - add fetched date range to redis store
 */
export async function fetchAndInsertAggregate({
    timespan,
    ticker,
    from,
    to,
}: {
    timespan: PermittedTimespan;
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
    const rowsForDatabase = priceActionObjectsToDatabaseRows(
        aggregateToPriceActionObjects(rawResponse)
    );

    const timestampsInserted: Array<{ timestamp: string | number }> =
        await makePooledQuery({
            text: format(
                "insert into %I (ticker, timestamp, open, close, high, low, volume) values %L returning (timestamp)",
                timescaleToTableName(timespan),
                rowsForDatabase
            ),
        });

    if (timestampsInserted.length) {
        return storeFetchedDateRange({
            ticker,
            timescale: timespanToTimescale(timespan),
            start: from,
            end: to,
        });
    }

    return [];
}
