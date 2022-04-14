/* Insert a number of PriceActionRow objects into the database */

import format from "pg-format";
import { Timescale } from "types/store.types";
import { PriceActionApiObject } from "../../../../../database/pools/query-objects";
import { objectToArray } from "../../../../../helpers/object-to-array";
import { storeFetchedDateRange } from "../../../../store/store-fetched-dates";
import { timescaleToTableName } from "../../../get-table-name";
import {
	aggregateFields,
	aggregateFieldsString,
} from "../../constants/aggregate";
import {
	PermittedTimespan,
	PolygonAggregateOptions,
} from "../../types/aggregate.types";
import { fetchAggregateWithLimiter } from "./fetch";
import { aggregateToPriceActionObjects } from "./transform";

/** Map a timespan like 'minute' to a timescale like '1m'. */
const timespanToTimescaleMap: { [K in PermittedTimespan]: Timescale } = {
	minute: "1m",
	hour: "1h",
	day: "1d",
};

type InsertOptions = Pick<
	PolygonAggregateOptions,
	"ticker" | "from" | "to" | "timespan"
>;

/**
 * Take an array of aggregate rows (presumably parsed from an aggregate fetch using
 * aggregateToPriceActionObjects, but could also be a manually constructed array),
 * and save the rows to table price_action_<1m|1h|1d>
 */
export async function insertAggregate<T>(
	rowsForDatabase: T,
	{ ticker, from, to, timespan }: InsertOptions
) {
	const text = format(
		"insert into %I (%s) values %L returning (timestamp)",
		timescaleToTableName(timespan),
		aggregateFieldsString,
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
	const rawResponse = await fetchAggregateWithLimiter({
		...options,
		multiplier: 1,
	});

	const priceActionArrays = aggregateToPriceActionObjects(rawResponse).map(
		(object) => objectToArray(object, aggregateFields)
	);

	const { ticker, timespan, from, to } = options;

	const response = await insertAggregate(priceActionArrays, {
		ticker,
		from,
		to,
		timespan,
	});

	return response;
}
