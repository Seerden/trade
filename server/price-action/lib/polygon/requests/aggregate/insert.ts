/* Insert a number of PriceActionRow objects into the database */

import format from "pg-format";
import { PriceActionApiObject } from "../../../../../database/pools/query-objects";
import { Timescale } from "../../../../../types/store.types";
import { storeFetchedDateRange } from "../../../../store/store-fetched-dates";
import {
	PermittedTimespan,
	timescaleToTableName,
} from "../../../get-table-name";
import { PolygonAggregateOptions } from "../../types/aggregate.types";
import { OHLC } from "../../types/ohlc.types";
import { fetchTickerAggregate } from "./fetch";
import { aggregateToPriceActionObjects } from "./transform";

/**
 * Mapping object, maps a timespan like 'minute' to a timescale like '1m'.
 * TODO: could optionally extend this with converters, since 'hour' can be
 * represented by '1h', but of course also by '60m' and '3600s'. Since the
 * current only use-case for this mapping is to get a param for a polygon
 * request, there's no need to worry about this right now, though.
 */
const timespanToTimescaleMap: { [K in PermittedTimespan]: Timescale } = {
	minute: "1m",
	hour: "1h",
	day: "1d",
};

/**
 * We re-use these columns in various places, and they always need to be in the
 * same order.
 * @todo should probably use a more specific variable name.
 */
const columnsString = "ticker, timestamp, open, close, high, low, volume";

/**
 * Take priceActionObjects (array of objects) and map to an array of arrays, for
 * use with pg-format.
 */
export function priceActionObjectsToDatabaseRows(
	priceActionObjects: ReturnType<typeof aggregateToPriceActionObjects>
) {
	const rowsForDatabase = priceActionObjects.map((row) => {
		const columns = columnsString.split(", ") as Array<OHLC>;
		return columns.map((column) => row[column]);
	});

	return rowsForDatabase;
}

type InsertArgs = {
	rowsForDatabase: ReturnType<typeof aggregateToPriceActionObjects>;
	options: Pick<PolygonAggregateOptions, "ticker" | "from" | "to" | "timespan">;
};

/**
 * Take an array of aggregate rows (presumably parsed from an aggregate fetch using
 * aggregateToPriceActionObjects, but could also be a manually constructed array),
 * and save the rows to table price_action_<1m|1h|1d>
 */
export async function insertAggregateIntoDatabase(
	rowsForDatabase: InsertArgs["rowsForDatabase"],
	{ ticker, from, to, timespan }: InsertArgs["options"]
) {
	const timestampsInserted: Array<{ timestamp: string | number }> =
		await PriceActionApiObject.query({
			text: format(
				"insert into %I %L values %L returning (timestamp)",
				timescaleToTableName(timespan),
				columnsString,
				rowsForDatabase
			),
		});

	if (timestampsInserted.length) {
		return storeFetchedDateRange({
			ticker,
			timescale: timespanToTimescaleMap[timespan],
			start: from,
			end: to,
		});
	}

	return [];
}

type Options = {
	timespan: PermittedTimespan;
	ticker: string;
	from: PolygonAggregateOptions["from"];
	to: PolygonAggregateOptions["to"];
};

/**
 * - fetch price aggregate for a ticker
 * - insert OHLCV values into database
 * - add fetched date range to redis store
 */
export async function fetchAndInsertAggregate(options: Options) {
	const rawResponse = await fetchTickerAggregate({
		...options,
		multiplier: 1,
	});

	const priceActionObjects = aggregateToPriceActionObjects(rawResponse);
	const rowsForDatabase = priceActionObjectsToDatabaseRows(priceActionObjects);

	const { ticker, timespan, from, to } = options;

	const timestampsInserted: Array<{ timestamp: string | number }> =
		await PriceActionApiObject.query({
			text: format(
				"insert into %I %L values %L returning (timestamp)",
				timescaleToTableName(timespan),
				columnsString,
				rowsForDatabase
			),
		});

	if (timestampsInserted.length) {
		return storeFetchedDateRange({
			ticker,
			timescale: timespanToTimescaleMap[timespan],
			// TODO: I don't like how we're not uniformly using either {start, end}
			// or {from, to}. Don't really care which one we use, but be consistent.
			start: from,
			end: to,
		});
	}

	return [];
}
