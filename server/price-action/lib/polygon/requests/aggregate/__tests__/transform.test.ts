import json from "../../../../constants/aggregateJson.json";
import { aggregateToPriceAction } from "../transform";

describe("aggregateToPriceAction", () => {
	test("transforms result correctly", () => {
		const result = aggregateToPriceAction(json);

		expect(result[0]).toStrictEqual({
			volume: 7448,
			open: 4.91,
			close: 5.47,
			high: 5.48,
			low: 4.55,
			timestamp: 1649673000000,
			ticker: "VERU",
		});
	});
});
