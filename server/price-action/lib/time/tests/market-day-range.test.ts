import { nMarketDayRange } from "../market-day-range";

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
