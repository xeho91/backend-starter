import { faker } from "@faker-js/faker";
import { describe, expectTypeOf, test } from "vitest";

import { extendMap } from "./map.js";

describe("extendMap(left, right)", () => {
	test("it succeed and returns correctly extended map", ({ expect }) => {
		const left = new Map<string, number>();
		const right = new Map<string, number>();

		for (let index = 0; index < 100; index++) {
			left.set(faker.string.sample(), faker.number.int());
			right.set(faker.string.sample(), faker.number.int());
		}

		extendMap(left, right);

		for (const [key, value] of right) {
			expect(left.has(key)).toBe(true);
			expect(left.get(key)).toBe(value);
		}
	});

	test("return type for extending two different maps is merged", () => {
		const left = new Map<number, string>();
		const right = new Map<string, number>();

		expectTypeOf(extendMap(left, right)).toEqualTypeOf<
			Map<number | string, string | number>
		>();
	});
});
