import { captureMessage } from "@sentry/node";
import { writeFile } from "fs/promises";
import { redisClient } from "../../../store/redis-client";
import { getDailyMostActive } from "../../database/queries/most-active";
import { isActiveMarketDay } from "../time/check-date";
import { getAllMarketDaysInPastTwoYears } from "../time/dates";
import {
	listMarketDaysInRange,
	nMarketDayRange,
} from "../time/market-day-range";

/**
 * Goal of this helper file: find out for which dates we haven't yet retrieved
 * 1-minute price action data for the (300 by default) most active tickers of
 * that day, and expose a function that queues the necessary jobs to fetch this
 * missing data.
 */

/**
 * @todo: This function actually adds entries to redis sets. In development, we
 * may end up calling this function without subsequently actually fetching the
 * data. On a second fetch of this function with overlapping dates, this means
 * the function will end up `continue`-ing for every date in the store, even
 * though we don't actually have data yet.
 * - We can programatically reset the associated redis keys,
 * - or we can do it through the redis cli: redis-cli keys "1m:*" | xargs redis-cli DEL
 */
export async function queueAggregateBacklog() {
	const datesToFetchFor = getAllMarketDaysInPastTwoYears().reverse();

	// Through iteration below, the following object will end up like
	// {
	//    'MSFT': ['2022-04-18', '2022-04-12'],
	//    'NFLX': ['2022-04-14', '2022-03-18']
	// }, where each date represents a 'to' value for nMarketDayRange()
	const dateEndpointsToFetchPerTicker: Record<string, string[]> = {};

	// TODO: instead of a while loop, we could pre-generate the list of relevant
	// dates, and use a for...of loop instead. That would also mean we wouldn't
	// need decrementCurrentDate() anymore.
	for (const date of datesToFetchFor) {
		// If we're here, 1d data exists for this date: fetch most active tickers
		// for this date.
		if (!isActiveMarketDay(date)) {
			continue;
		}

		// TODO: optimization: instead of fetching per date, just fetch data for
		// the whole relevant date range at the start of this function.
		const priceActionRows = await getDailyMostActive({
			date,
			tickerCount: 300,
			timespan: "day",
		});

		if (Array.isArray(priceActionRows) && !priceActionRows?.length) {
			// If we're here, it means we didn't get data for this date.
			captureMessage("getDailyMostActive: database returned 0 rows.", {
				extra: {
					date,
				},
			});

			continue;
		}

		// TODO: {n: 51} is a magic number. If there is data for every minute, 51
		// days maximizes the allowed query size. Use a constant variable for
		// this, or make `n` an optional argument in nMarketDayRange, with the
		// default set to this magic number.
		const [start, end] = nMarketDayRange({ n: 51, end: date });
		const dateRangeForMaxAggregateQueryEndingThisDate = listMarketDaysInRange(
			start,
			end
		);

		const activeTickers = Array.from(
			// Should only contain one row per ticker, but let's filter just in case.
			new Set(priceActionRows.map((value) => value.ticker))
		);

		for (const ticker of activeTickers) {
			const redis1mKeyForTicker = `1m:${ticker}`;

			// If the below === true, then the date is already present in 1m:${ticker}
			if (!(await redisClient.sismember(redis1mKeyForTicker, date))) {
				const multi = redisClient.multi();
				for (const dateInRange of dateRangeForMaxAggregateQueryEndingThisDate) {
					multi.sadd(redis1mKeyForTicker, dateInRange);
				}

				// TODO: what does a multi exec return? Need to handle errors/failed
				// sadd calls regardless, but return type guides implementation.

				// TODO: instead of creating a new multi() for each {ticker, date}
				// combination, only create one per {date}, since we're guaranteed
				// to only encounter each ticker at most once per date, so batching
				// the execution per date is an easy performance win.
				await multi.exec();

				// Add date to the list.
				if (!dateEndpointsToFetchPerTicker[ticker]) {
					dateEndpointsToFetchPerTicker[ticker] = [date];
				} else {
					dateEndpointsToFetchPerTicker[ticker].push(date);
				}
			}
		}

		console.log(`Retrieved (ticker, date) tuples to fetch for ${date}`);
	}

	return dateEndpointsToFetchPerTicker;
}

export async function writeAggregateTickerDateTuplesToFetchToFile() {
	const tuples = await queueAggregateBacklog();

	const stringifiedTuples = JSON.stringify(tuples);

	await writeFile("data/aggregate-tuples-to-fetch.json", stringifiedTuples);
}
