import format from "pg-format";
import { makePooledQuery } from "../pool/query-functions";

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
