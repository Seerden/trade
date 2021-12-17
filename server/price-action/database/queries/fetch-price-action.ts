import format from "pg-format";
import { DateDayjsOrString } from "../../../types/date.types";
import { asMillisecondUnixTimestamp } from "../../lib/time/as-unix-ms";
import { makePooledQuery } from "../pool/query-functions";

type Options = {
    ticker: string;
    from: DateDayjsOrString;
    to: DateDayjsOrString;
    limit?: string | number;
};

/**
 * Query our database for 1-minute price action data for one ticker, for a given date range
 */
export async function fetchOneMinute({ ticker, from, to, limit = "ALL" }: Options) {
    return await makePooledQuery({
        text: format(
            `select * from price_action_1m where ticker = '%s' and timestamp between %L and %L limit %L`,
            ticker.toUpperCase(),
            asMillisecondUnixTimestamp(from),
            asMillisecondUnixTimestamp(to),
            limit
        ),
    });
}
