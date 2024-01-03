import { describe, test } from "vitest";

import { prettyJSON } from "./json.js";

describe("prettyJSON(data)", () => {
	test("throws error on the invalid JSON syntaxes", ({ expect }) => {
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(() => prettyJSON(undefined)).toThrowError();
	});

	test("succees on the valid JSON syntaxes", ({ expect }) => {
		expect(() => prettyJSON("hello")).not.toThrowError();
		expect(() => prettyJSON(1337)).not.toThrowError();
		expect(() => prettyJSON(null)).not.toThrowError();
		expect(() => prettyJSON("null")).not.toThrowError();
		expect(() => prettyJSON(["hello", 1337])).not.toThrowError();
		expect(() =>
			prettyJSON({
				hello: "world",
				awesomeness: 1337,
			}),
		).not.toThrowError();
	});

	test("it doesn't include entries with 'undefined' values", ({ expect }) => {
		const special = { x: undefined };

		expect(() => prettyJSON(special)).not.toThrowError();
		expect(prettyJSON(special)).toBe("{}");
	});
});
