import { LOG_LEVELS } from "@packages/logger";
import { describe, test } from "vitest";

import { ENVIRONMENTS, loadConfig } from "./main.js";

describe("loadConfig()", () => {
	test("it succeed when the project workspace is set up correctly", async ({
		expect,
	}) => {
		expect(async () => await loadConfig()).not.toThrow();
	});

	describe("general:", async () => {
		const config = await loadConfig();

		test("- 'debug' is boolean", ({ expect }) => {
			expect(config.get("debug")).toBeTypeOf("boolean");
		});

		test(`- 'env' is string from enum: [${ENVIRONMENTS}]`, ({ expect }) => {
			const env = config.get("env");

			expect(env).toBeTypeOf("string");
			expect(ENVIRONMENTS).toContain(env);
		});

		test(`- 'log' is string from enum: [${LOG_LEVELS}]`, ({ expect }) => {
			const level = config.get("log");

			expect(level).toBeTypeOf("string");
			expect(LOG_LEVELS).toContain(level);
		});
	});
});
