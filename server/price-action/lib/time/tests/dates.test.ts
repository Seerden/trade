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

describe("getNearestFinished", () => {
	test("returns previous market day if `date`'s market session not finished yet", () => {
		const result = getNearestPastFinishedMarketDay("2022-04-19 21:08");

		expect(result).toEqual("2022-04-18");
	});

	test("return same day if past market close", () => {
		const result = getNearestPastFinishedMarketDay("2022-04-19 22:50");
		expect(result).toEqual("2022-04-19");
	});

	// TODO: Still need to test behavior if passed future date. But that requires
	// checking whether today is an active and finished session.
});
