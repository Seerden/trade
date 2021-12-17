import format from "pg-format";
import { DateDayjsOrString } from "../../../types/date.types";
import { PermittedTimespan, timescaleToTableName } from "../../lib/get-table-name";
import { asMillisecondUnixTimestamp } from "../../lib/time/as-unix-ms";
import { makePooledQuery } from "../pool/query-functions";

type Options = {
    timescale: PermittedTimespan;
    ticker: string;
    from: DateDayjsOrString;
    to: DateDayjsOrString;
    limit?: string | number;
};

/**
 * Fetch price action for one ticker for a given date range and timescale
 */
export async function fetchPriceActionForTicker({
    timescale,
    ticker,
    from,
    to,
    limit = "ALL",
}: Options) {
    return await makePooledQuery({
        text: format(
            `select * from %I where ticker = '%s' and timestamp between %L and %L limit %L`,
            timescaleToTableName(timescale),
            ticker.toUpperCase(),
            asMillisecondUnixTimestamp(from),
            asMillisecondUnixTimestamp(to),
            limit
        ),
    });
}
