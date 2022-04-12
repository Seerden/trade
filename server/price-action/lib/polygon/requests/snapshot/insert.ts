import format from "pg-format";
import { PriceActionApiObject } from "../../../../../database/pools/query-objects";
import { DateDayjsOrString } from "../../../../../types/date.types";
import { fetchDailyOHLC } from "./fetch";
import { snapshotToPriceAction } from "./transform";

export async function fetchAndInsertSnapshot({ date }: { date: DateDayjsOrString }) {
	const rawResponse = await fetchDailyOHLC({ date });
	const priceActionObjects = snapshotToPriceAction(rawResponse);
	if (!priceActionObjects.length) return;

	const columns = "ticker, timestamp, open, close, high, low, volume".split(", ");
	const priceActionObjectsAsArrays = priceActionObjects.map((row) =>
		// @ts-ignore Fix the typing on priceActionObjects and then on row[column]
		columns.map((column) => row[column])
	);

	return PriceActionApiObject.query({
		text: format(
			`
                insert into price_action_1d (ticker, timestamp, open, close, high, low, volume) values %L 
                returning timestamp
            `,
			priceActionObjectsAsArrays
		),
	}) as unknown;
}
