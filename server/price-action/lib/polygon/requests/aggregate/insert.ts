/* Insert a number of PriceActionRow objects into the database */

import format from "pg-format";
import { PriceActionRow } from "types/database.types";
import { PriceActionApiObject } from "../../../../../database/pools/query-objects";
import { Timescale } from "../../../../../types/store.types";
import { storeFetchedDateRange } from "../../../../store/store-fetched-dates";
import { timescaleToTableName } from "../../../get-table-name";
import {
	PermittedTimespan,
	PolygonAggregateOptions,
} from "../../types/aggregate.types";
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

/** Use a fields variable so that we know they're always in the right order. */
const fieldsString = "ticker, timestamp, open, close, high, low, volume";
const fields = fieldsString.split(", ") as Array<OHLC>;

/** Map a priceActionObject to an array, for use with pg-format */
function priceActionObjectToArray(priceActionObject: PriceActionRow) {
	return fields.map((column) => priceActionObject[column]);
}

type InsertOptions = Pick<
	PolygonAggregateOptions,
	"ticker" | "from" | "to" | "timespan"
>;

/**
 * Take an array of aggregate rows (presumably parsed from an aggregate fetch using
 * aggregateToPriceActionObjects, but could also be a manually constructed array),
 * and save the rows to table price_action_<1m|1h|1d>
 */
export async function insertAggregate(
	rowsForDatabase: ReturnType<typeof priceActionObjectToArray>[],
	{ ticker, from, to, timespan }: InsertOptions
) {
	const text = format(
		"insert into %I (%s) values %L returning (timestamp)",
		timescaleToTableName(timespan),
		fieldsString,
		rowsForDatabase
	);

	const timestampsInserted: string[] = await PriceActionApiObject.query({
		text,
	});

	if (!timestampsInserted.length) {
		return [];
	}

	return storeFetchedDateRange({
		ticker,
		timescale: timespanToTimescaleMap[timespan],
		start: from,
		end: to,
	});
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
	const rowsForDatabase = priceActionObjects.map((object) =>
		priceActionObjectToArray(object)
	);

	const { ticker, timespan, from, to } = options;

	const response = await insertAggregate(rowsForDatabase, {
		ticker,
		from,
		to,
		timespan,
	});

	return response;
}
