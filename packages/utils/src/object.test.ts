import { describe, expectTypeOf, test } from "vitest";

import { cleanUndefinedValues, typedObjectKeys } from "./object.js";

describe("cleanUndefinedValues(object)", () => {
	test("removes the entries with 'undefined' values", ({ expect }) => {
		const input = {
			dirty1: undefined,
			dirty2: undefined,
			ok1: 1337,
			ok2: 2023,
		} as const;
		const clean = cleanUndefinedValues(input);

		expect(clean).not.toHaveProperty("dirty1");
		expect(clean).not.toHaveProperty("dirty2");
		expect(clean).toHaveProperty("ok1");
		expect(clean).toHaveProperty("ok2");
	});
});

describe("typedObjectKeys(object)", () => {
	test("returns an array of object keys and matches the expected type", ({
		expect,
	}) => {
		const input = {
			key1: 1337,
			key2: 2023,
		} as const;

		expect(typedObjectKeys(input)).toEqual(Object.keys(input));
		expectTypeOf(typedObjectKeys(input)).toEqualTypeOf<
			Array<"key1" | "key2">
		>();
	});
});
