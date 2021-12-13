/*
    - there is a general price_action table available in our database
    - each ticker table inherits from this general table
        - there are no additional columns that we manually input, but each ticker table should automatically generate a `ticker` column for each row
        of course, for each given ticker table, all `ticker` values would be the same. the presence of this column helps when we want to access data from the price_action table directly, though.
*/

import { Timescale } from "../../../types/store.types";
import { tickerTableExists } from "../../store/ticker-table-exists";
import { makePooledQueries } from "../pool/query-functions";
import { UNSAFE_sanitize } from "./UNSAFE_sql_template_literals";

/**
 * Create a ticker table for the given ticker and the given timescale,
 * if this table doesn't already exist
 */
export async function maybeCreateTickerTable(ticker: string, timescale: Timescale) {
    /* premature optimization: I have a feeling it's faster and much more useful to store a list of tickers (in Redis) for which we already have tables
        instead of somehow always running a "create table TICKER_NAME if not exists" whenever we fetch data.
        so use something like       const tickerTableExists = await redisClient.get(`${ticker}-table-exists`)
        instead of a query like     select exists ( select from pg_tables where tablename = $1 );
    */

    const tableExists = await tickerTableExists(ticker, timescale);
    if (tableExists) {
        console.log("EXISTS ALREADY");
        return "table exists";
    }

    try {
        const tableName = UNSAFE_sanitize(`${ticker}_${timescale}`);
        const parentTableName = UNSAFE_sanitize(`price_action_${timescale}`);
        const tickerSanitized = UNSAFE_sanitize(ticker);

        if (!tickerSanitized.length) throw new Error("Invalid ticker supplied");

        console.log(`creating table ${tableName}...`);

        // @todo: create (brin?) index on timestamp
        return await makePooledQueries([
            // create ticker table (e.g. "msft_1m")
            {
                text: `
                create table ${tableName} (
                    ticker varchar(16),
                    timestamp numeric(16) not null unique primary key
                )
                inherits (${parentTableName});
            `,
            },
            // create trigger that will add the correct ticker value to each row on insert
            {
                text: `
                    create trigger ticker_trigger_${tableName}
                    before insert on ${tableName}
                    for each row execute procedure set_ticker(${tickerSanitized});
                `,
            },
            // create brin index on timestamp
            {
                text: `
                    create index idx_timestamp_${tableName} on ${tableName} using brin(timestamp);
                `,
            },
        ]);
    } catch (error) {
        console.log(`ERROR CREATING ${ticker}_${timescale}`);
        console.error(error);
    }
}
