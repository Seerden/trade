import format from "pg-format";
import { DateDayjsOrString } from "../../../../../types/date.types";
import { makePooledQuery } from "../../../../database/pool/query-functions";
import { fetchDailyOHLC } from "./snapshot-fetch";
import { snapshotToPriceAction } from "./snapshot-to-rows";

export async function fetchAndInsertSnapshot({ date }: { date: DateDayjsOrString }) {
    const rawResponse = await fetchDailyOHLC({ date });
    const priceActionObjects = snapshotToPriceAction(rawResponse);
    if (!priceActionObjects.length) return;

    const columns = "ticker, timestamp, open, close, high, low, volume".split(", ");
    const priceActionObjectsAsArrays = priceActionObjects.map((row) =>
        // @ts-ignore Fix the typing on priceActionObjects and then on row[column]
        columns.map((column) => row[column])
    );

    return makePooledQuery({
        text: format(
            `
                insert into price_action_1d (ticker, timestamp, open, close, high, low, volume) values %L 
                returning timestamp
            `,
            priceActionObjectsAsArrays
        ),
    }) as unknown;
}
