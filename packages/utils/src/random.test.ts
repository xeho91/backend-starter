import { describe, it } from "vitest";

import { prettyJSON } from "./json.js";
import {
	getRandomInteger,
	getRandomNumber,
	pickRandomItem,
	pickRandomItems,
} from "./random.js";

describe(`getRandomInteger(options?)`, () => {
	it("returns integer without options", ({ expect }) => {
		const int = getRandomInteger();
		expect(int).toBeTypeOf("number");
		expect(Number.isInteger(int)).toBe(true);
	});

	it(`every new generated integer number is NOT same as previous one`, ({
		expect,
	}) => {
		let cached = 0;

		for (let index = 0; index < 1000; index++) {
			const int = getRandomInteger();

			expect(int).toBeTypeOf("number");
			expect(Number.isInteger(int)).toBe(true);
			expect(int).not.toEqual(cached);

			cached = int;
		}
	});

	const options = { min: 1, max: 10 } as const;

	it(`returns a random integer number in range with options - ${prettyJSON(
		options,
	)}`, ({ expect }) => {
		for (let index = 0; index < 100; index++) {
			const int = getRandomInteger(options);

			expect(int).toBeGreaterThanOrEqual(options.min);
			expect(int).toBeLessThanOrEqual(options.max);
		}
	});
});

describe(`getRandomNumber(options?)`, () => {
	it("returns number without options", ({ expect }) => {
		expect(getRandomNumber()).toBeTypeOf("number");
	});

	it(`every new generated number is NOT same as previous one`, ({
		expect,
	}) => {
		let cached = 0;

		for (let index = 0; index < 1000; index++) {
			const number = getRandomNumber();

			expect(getRandomNumber()).toBeTypeOf("number");
			expect(number).not.toEqual(cached);

			cached = number;
		}
	});

	const options = { min: 1, max: 10 } as const;

	it(`returns a random number (could be double) in range with options: ${prettyJSON(
		options,
	)}`, ({ expect }) => {
		for (let index = 0; index < 100; index++) {
			const number = getRandomNumber(options);

			expect(number).toBeGreaterThanOrEqual(options.min);
			expect(number).toBeLessThanOrEqual(options.max);
		}
	});
});

const SAMPLE_ARRAY = [1337, "xeho91", true, 0, -1] as const;

describe("pickRandomItem(array)", () => {
	const randomItem = pickRandomItem(SAMPLE_ARRAY);

	it("Returns a random item from the provided array", ({ expect }) => {
		expect(SAMPLE_ARRAY).toContain(randomItem);
	});
});

describe("pickRandomItems(array, options?)", () => {
	const count = 3;
	const items = pickRandomItems(SAMPLE_ARRAY, { count });

	it("returns an array of sample values picked from the provided array and count", ({
		expect,
	}) => {
		expect(items).toHaveLength(count);

		for (const item of items) {
			expect(SAMPLE_ARRAY).toContain(item);
		}
	});
});
