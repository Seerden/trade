import { mockRawYfResponse, mockYfResponse } from "../constants/mock/mock-yf-response";
import { makeYfResponseObject } from "./make-response-object";

describe("makeYfResponseObject", () => {
    test("makes proper response", () => {
        expect(makeYfResponseObject(mockRawYfResponse)).toMatchObject(mockYfResponse);
    });
});
