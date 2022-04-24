import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../../types/date.types";
import { fetchAggregateWithLimiter } from "../../../lib/polygon/requests/aggregate/fetch";
import { fetchAndInsertAggregate } from "../../../lib/polygon/requests/aggregate/insert";
import { unixMillis } from "../../../lib/time/date-manipulation";
import { formatYMD } from "../../../lib/time/format-YMD";
import { nMarketDayRange } from "../../../lib/time/market-day-range";

const maxDaysPerQuery = Math.floor(50_000 / (16 * 60));

export async function fetchMaxOneMinuteData({
	ticker,
	to,
}: {
	ticker: string;
	to?: DateDayjsOrString;
}) {
	// eslint-disable-next-line prefer-const
	let [start, end] = nMarketDayRange({ n: maxDaysPerQuery, end: to });
	const twoYearsAgo = dayjs().startOf("day").add(-2, "year").add(1, "day");

	if (unixMillis(start) < unixMillis(twoYearsAgo)) {
		start = formatYMD(twoYearsAgo);
	}

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
	// eslint-disable-next-line prefer-const
	let [start, end] = nMarketDayRange({ n: maxDaysPerQuery, end: to });
	const twoYearsAgo = dayjs(start).add(-2, "year").add(1, "day");

	if (unixMillis(start) < unixMillis(twoYearsAgo)) {
		start = formatYMD(twoYearsAgo);
	}

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
