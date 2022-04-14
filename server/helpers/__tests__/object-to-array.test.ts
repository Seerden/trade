import { objectToArray } from "../object-to-array";

const obj = {
	a: 1,
	b: "test",
	c: true,
};

const fields = "a b c".split(" ") as Array<keyof typeof obj>;

describe("objectToArray", () => {
	test("returns correct array if all fields exist in object", () => {
		const result = objectToArray(obj, fields);

		expect(result).toEqual([1, "test", true]);
	});

	test("throws error if empty fields array provided", () => {
		expect(objectToArray(obj, [])).toBeUndefined();
	});

	test("returns undefined if at least one field is not in object", () => {
		// @ts-ignore - TypeScript actually catches this one, but we can't always
		// typecheck these in production, since perhaps fields is returned by an
		// API and we won't know ahead of time what its type is.
		expect(objectToArray(obj, ["d"])).toBeUndefined();
	});
});
