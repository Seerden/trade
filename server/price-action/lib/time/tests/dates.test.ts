import dayjs from "dayjs";
import { isHoliday, isWorkday } from "../check-date";
import { getAllMarketDaysInPastTwoYears } from "../dates";
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