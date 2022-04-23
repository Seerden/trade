import { DateDayjsOrString } from "../../../../types/date.types";
import { fetchAggregateWithLimiter } from "../../../lib/polygon/requests/aggregate/fetch";
import { fetchAndInsertAggregate } from "../../../lib/polygon/requests/aggregate/insert";
import { nMarketDayRange } from "../../../lib/time/market-day-range";

const maxDaysPerQuery = Math.floor(50_000 / (16 * 60));

export async function fetchMaxOneMinuteData({
	ticker,
	to,
}: {
	ticker: string;
	to?: DateDayjsOrString;
}) {
	const [start, end] = nMarketDayRange({ n: maxDaysPerQuery, end: to });

	const rawResponse = await fetchAggregateWithLimiter({
		ticker,
		from: start,
		to: end,
		timespan: "minute",
		multiplier: 1,
	});

	return rawResponse;
}

export async function fetchAndInsertMaxOneMinuteData({
	ticker,
	to,
}: {
	ticker: string;
	to?: DateDayjsOrString;
}) {
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
		return "error";
	}
}
