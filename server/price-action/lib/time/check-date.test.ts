import { DateDayjsOrString } from "../../../types/date.types";
import { isWeekday } from "./check-date";

/* dates given are friday, saturday, sunday */
const cases = [
    ["Dec 10, 2021", true],
    ["Dec 11, 2021", false],
    ["Jan 2, 2022", false],
] as Array<[DateDayjsOrString, boolean]>;

describe("is-weekday", () => {
    test.each(cases)("returns correct day of week", (date, expected) => {
        const result = isWeekday(date);
        expect(result).toEqual(expected);
    });
});
