import { describe, test } from "vitest";

import { loadDotenv } from "./dotenv.js";

describe("loadDotenv()", () => {
	test("succeed when it can find the '.env' file at the root of the workspace and parse it", async ({
		expect,
	}) => {
		expect(async () => await loadDotenv()).not.toThrowError();
	});

	test("the dotenv has a required property", async ({ expect }) => {
		const env = await loadDotenv();

		expect(env).toHaveProperty("DB_PASSWORD");
	});
});
