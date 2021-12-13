import format from "pg-format";
import { YFRow } from "../../../types/api.types";
import { fetchTenYearDailyPriceAction } from "../../lib/fetch-price-action/fetch-ticker-history";
import { yfResponseToRows } from "../../lib/parse-yf/quote-to-row";
import { makePooledQuery } from "../pool/query-functions";
import { maybeCreateTickerTable } from "./create-ticker-table";

/**
 * Batch insert a number of rows into a __single__ ticker table
 */
export async function batchInsertRows(tableName: string, rowsToInsert: Array<YFRow>) {
    const propertiesInOrder = "timestamp open high low close volume".split(" ");
    const rowObjectsAsArrays = rowsToInsert.map((row) =>
        propertiesInOrder.map((property) => row[property])
    );

    if (!rowObjectsAsArrays.length) return;

    const formattedText = format(
        "insert into %I (timestamp, open, high, low, close, volume) values %L returning 1",
        tableName,
        rowObjectsAsArrays
    );

    try {
        const rows = await makePooledQuery({
            text: formattedText,
        });
        return rows;
    } catch (error) {
        console.error(error);
    }
}

export async function insertTenYearDailyPriceAction(ticker: string) {
    await maybeCreateTickerTable(ticker, "1d");
    const rawResponse = await fetchTenYearDailyPriceAction(ticker);
    const rowsForDatabase = yfResponseToRows(rawResponse);
    const tableName = `${ticker}_1d`;
    const insertedRows = await batchInsertRows(tableName, rowsForDatabase);
    return insertedRows;
}
