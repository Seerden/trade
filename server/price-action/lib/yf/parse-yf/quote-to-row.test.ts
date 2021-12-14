import { YFResponse } from "../../../../types/api.types";
import { isValidYfResponse } from "./quote-to-row";

describe("isValidQuoteResponse", () => {
    test("returns true if all keys present", () => {
        const validQuote: YFResponse = {
            close: [1],
            high: [4],
            open: [3],
            low: [2],
            volume: [1],
            timestamp: [1],
        };
        expect(isValidYfResponse(validQuote)).toBeTruthy();
    });
    test("returns false if not all keys present", () => {
        const invalidQuote: Partial<YFResponse> = {
            close: [1],
            high: [2],
            open: [3],
        };

        expect(isValidYfResponse(invalidQuote as YFResponse)).toBeFalsy();
    });
    test("returns false if array lengths are not all equal", () => {
        const invalidQuote: YFResponse = {
            open: [1, 2],
            low: [1],
            high: [1],
            close: [1],
            volume: [1],
            timestamp: [1],
        };
        expect(isValidYfResponse(invalidQuote)).toBeFalsy();
    });
});
