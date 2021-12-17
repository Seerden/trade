import { DateDayjsOrString } from "../../../../types/date.types";
import { fetchAndInsertAggregate } from "../../../lib/polygon/requests/aggregate/aggregate-insert";
import { nMarketDayRange } from "../../../lib/time/market-day-range";

export async function fetchMaxOneMinuteData({
    ticker,
    to,
}: {
    ticker: string;
    to?: DateDayjsOrString;
}) {
    const maxDaysPerQuery = Math.floor(50_000 / (16 * 60));
    const [start, end] = nMarketDayRange({ n: maxDaysPerQuery, end: to });

    try {
        return await fetchAndInsertAggregate({
            timespan: "minute",
            ticker,
            from: start,
            to: end,
        });
    } catch (error) {
        console.error(error);
    }
}
