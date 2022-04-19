import dayjs from "dayjs";
import { isHoliday, isWorkday } from "../check-date";
import {
	getAllMarketDaysInPastTwoYears,
	getNearestPastFinishedMarketDay,
} from "../dates";
import { formatYMD } from "../format-YMD";

describe("getAllMarketDaysInPastTwoYears", () => {
	test("returns correct values", () => {
		const result = getAllMarketDaysInPastTwoYears();

		const today = dayjs().startOf("day");
		const twoYearsAgo = today.add(-2, "years");

		const expected = [
			...(isWorkday(twoYearsAgo) && !isHoliday(twoYearsAgo)
				? [formatYMD(twoYearsAgo)]
				: []),
			...(isWorkday(today) && !isHoliday(today) ? [formatYMD(today)] : []),
		];

		expect(result).toEqual(expect.arrayContaining(expected));
		expect(result.length).toBeGreaterThan(400);
		expect(result.length).toBeLessThan(600);
	});
});

describe("getNearestFinishedMarketDay", () => {
	test("returns correct value if passed a regular trading day that's still in session", () => {
		const result = getNearestPastFinishedMarketDay("2022-04-19 19:58");
		expect(result).toEqual("2022-04-18");
	});

	test("returns correct value if given easter sunday", () => {
		const result = getNearestPastFinishedMarketDay("2022-04-17 15:00");
		expect(result).toEqual("2022-04-14");
	});

	test("returns correct result if given a date in the future", () => {
		const result = getNearestPastFinishedMarketDay("2022-05-15");
		expect(result).toEqual("2022-04-18");
	});
});
