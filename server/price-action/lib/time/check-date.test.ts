import dayjs from "dayjs";
import { DateDayjsOrString } from "../../../types/date.types";
import { isActiveMarketDay, isWorkday } from "./check-date";

/* dates given are friday, saturday, sunday */
const cases = [
    ["Dec 10, 2021", true],
    ["Dec 11, 2021", false],
    ["Jan 2, 2022", false],
] as Array<[DateDayjsOrString, boolean]>;

describe("isWorkday", () => {
    test.each(cases)("returns correct day of week", (date, expected) => {
        const result = isWorkday(date);
        expect(result).toEqual(expected);
    });
});

describe("activeMarketDay", () => {
    const cases: Array<[string, boolean]> = [
        ["2021 Dec 24", false],
        ["2021 Dec 10", true],
    ];
    test.each(cases)("returns correct value", (date, expected) => {
        expect(isActiveMarketDay(dayjs(date))).toEqual(expected);
    });
});
