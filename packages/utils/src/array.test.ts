import { describe, test } from "vitest";

import { chunkArray } from "./array.js";

describe("splitArray(array, limit)", () => {
	test("it returns same array when it doesn't exceed the limit", ({
		expect,
	}) => {
		const array = [1, 2, 3, 4, 5];

		expect(chunkArray(array, 10)).toEqual(array);
	});

	test("it returns chunked array of arrays, when exceed limit", ({
		expect,
	}) => {
		const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		expect(chunkArray(array, 2)).toEqual([
			[1, 2],
			[3, 4],
			[5, 6],
			[7, 8],
			[9, 10],
		]);

		expect(chunkArray(array, 3)).toStrictEqual([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[10],
		]);
	});
});
