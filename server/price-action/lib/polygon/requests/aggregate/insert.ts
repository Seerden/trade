/* Insert a number of PriceActionRow objects into the database */

import { captureMessage } from "@sentry/node";
import format from "pg-format";
import { Timescale } from "types/store.types";
import { PriceActionApiObject } from "../../../../../database/pools/query-objects";
import { objectToArray } from "../../../../../helpers/object-to-array";
import { storeFetchedDateRange } from "../../../../store/store-fetched-dates";
import { priceActionFields } from "../../../constants/fields";
import { timespanToTableMap } from "../../../get-table-name";
import { aggregateFieldsString } from "../../constants/aggregate";
import {
	PermittedTimespan,
	PolygonAggregateOptions,
} from "../../types/aggregate.types";
import { fetchAggregateWithLimiter } from "./fetch";
import { aggregateToPriceAction } from "./transform";

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
	try {
		const text = format(
			"insert into %I (%s) values %L returning (timestamp)",
			timespanToTableMap[timespan],
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
	} catch (error) {
		captureMessage("Error inserting aggregate into database.", {
			extra: {
				rowsForDatabase,
				options: { ticker, from, to, timespan },
			},
		});
	}
}

/**
 * - fetch price aggregate for a ticker
 * - insert OHLCV values into database
 * - add fetched date range to redis store
 */
export async function fetchAndInsertAggregate({
	timespan,
	ticker,
	from,
	to,
}: {
	timespan: PermittedTimespan;
	ticker: string;
	from: PolygonAggregateOptions["from"];
	to: PolygonAggregateOptions["to"];
}) {
	const rawResponse = await fetchAggregateWithLimiter({
		timespan,
		ticker,
		from,
		to,
		multiplier: 1,
	});

	const priceActionObjects = aggregateToPriceAction(rawResponse);
	const priceActionArrays = priceActionObjects.map((obj) =>
		objectToArray(obj, priceActionFields)
	);

	const response = await insertAggregate(priceActionArrays, {
		ticker,
		from,
		to,
		timespan,
	});

	return response;
}
