import { listMarketDaysInRange, nMarketDayRange } from "../market-day-range";

describe("nMarketDayRange", () => {
	test("correctly returns range spanning across a weekend going forwards", () => {
		/*  start at 17 December, which is a Friday
            expect the next monday (which isn't a holiday) to be the other endpoint */
		const result = nMarketDayRange({ n: 2, start: "2021-12-17" });
		expect(result).toHaveLength(2);
		expect(result).toContain("2021-12-17");
		expect(result).toContain("2021-12-20");
	});
	test("correctly returns range spanning across a weekend going backwards", () => {
		const result = nMarketDayRange({ n: 2, end: "2021-12-20" });
		expect(result).toHaveLength(2);
		expect(result).toContain("2021-12-17");
		expect(result).toContain("2021-12-20");
	});
});

describe("listMarketDaysInRange", () => {
	test("returns correct list if given dates around Easter weekend", () => {
		const result = listMarketDaysInRange("2022-04-15", "2022-04-18");
		expect(result).toStrictEqual(["2022-04-18"]);
	});

	test("returns empty list if given a weekend", () => {
		expect(listMarketDaysInRange("2022-04-16", "2022-04-17")).toStrictEqual([]);
	});

	test("returns falsy value if !(end > start)", () => {
		expect(listMarketDaysInRange("2022-04-19", "2022-04-19")).toBeFalsy();
	});
});
