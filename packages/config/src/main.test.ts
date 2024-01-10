import { Name } from "@packages/core/name";
import { Password } from "@packages/core/password";
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
			expect(config.DEBUG).toBeTypeOf("boolean");
		});

		test(`- 'env' is string from enum: [${ENVIRONMENTS}]`, ({ expect }) => {
			const env = config.NODE_ENV;

			expect(env).toBeTypeOf("string");
			expect(ENVIRONMENTS).toContain(env);
		});

		test(`- 'log' is string from enum: [${LOG_LEVELS}]`, ({ expect }) => {
			const level = config.LOG;

			expect(level).toBeTypeOf("string");
			expect(LOG_LEVELS).toContain(level);
		});

		describe("database:", () => {
			const { DB_USER, DB_PASSWORD, DB_HOSTNAME, DB_PORT, DB_NAME } =
				config;

			test("- 'user' is Name", ({ expect }) => {
				expect(DB_USER).toBeInstanceOf(Name);
			});

			test("- 'password' is Password", ({ expect }) => {
				expect(DB_PASSWORD).toBeInstanceOf(Password);
			});

			test("- 'hostname' is string", ({ expect }) => {
				expect(DB_HOSTNAME).toBeTypeOf("string");
			});

			test("- 'port' is number", ({ expect }) => {
				expect(DB_PORT).toBeTypeOf("number");
			});

			test("- 'name' is Name", ({ expect }) => {
				expect(DB_NAME).toBeInstanceOf(Name);
			});
		});
	});
});
