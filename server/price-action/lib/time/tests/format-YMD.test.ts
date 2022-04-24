import dayjs from "dayjs";
import { formatYMD } from "../format-YMD";

describe("formatYMD", () => {
	test("formats valid date", () => {
		const expected = "2022-04-14";

		// Formats date object.
		expect(formatYMD(new Date("2022-04-14"))).toBe(expected);

		// Formats string.
		expect(formatYMD("April 14 2022")).toBe(expected);

		// Formats dayjs object.
		expect(formatYMD(dayjs("2022 Apr 14"))).toBe(expected);
	});

	test("doesn't format invalid date", () => {
		expect(formatYMD("not a valid date")).toBeUndefined();
	});
});
