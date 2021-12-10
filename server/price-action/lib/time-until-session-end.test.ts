import dayjs from "dayjs";
import { isActiveMarketDay } from "./time-until-session-end";

describe("activeMarketDay", () => {
    const cases: Array<[string, boolean]> = [
        ["2021 Dec 24", false],
        ["2021 Dec 10", true],
    ];
    test.each(cases)("returns correct value", (date, expected) => {
        expect(isActiveMarketDay(dayjs(date))).toEqual(expected);
    });
});
