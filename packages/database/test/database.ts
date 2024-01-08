import { loadConfig } from "@packages/config";
import { beforeAll } from "vitest";

import { runDatabaseMigrations } from "../src/migration.js";

beforeAll(async () => {
	const config = await loadConfig();

	await runDatabaseMigrations(config);
});
