import { promises as fs } from "fs";
import path from "path";

const filePath = path.resolve(__dirname, "nasdaq_screener_1639341862041.csv");

/* nasdaq_screener_*.csv is a CSV downloaded from NASDAQ which contains a list of all tickers and 
    some related information (like last close, market cap., etc.)
*/

/**
 * Extract all tickers from NASDAQ csv. Note that we don't need a CSV parser or a
 * stream solution, since the CSV file is relatively small and each row is already on a
 * new line.
 */
export async function makeTickerArray() {
    const data = await fs.readFile(filePath);
    const csvRows = data.toString().replaceAll("\r", "").split("\n");
    const columns = csvRows[0].split(",");
    const symbolKeyIndex = columns.indexOf("Symbol");

    const tickerList: string[] = [];

    for (const row of csvRows.slice(1)) {
        const tickerSymbol = row.split(",")[symbolKeyIndex];
        if (!tickerSymbol.length) continue;
        // filter out ADS tickers (depository shares) - we don't care about these in any way
        if (tickerSymbol.includes("^") || tickerSymbol.includes("/")) continue;

        tickerList.push(tickerSymbol.replaceAll(/\s/g, ""));
    }

    return tickerList;
}
