// WARN: Important!
// I can't reuse ESM in `@package/config`, due to the existing issues:
// - on ESM & TypeScript: https://github.com/drizzle-team/drizzle-kit-mirror/issues/55
// - on when the `drizzle-kit` will be open-sourced:  https://github.com/drizzle-team/drizzle-orm/issues/580

import path from "node:path";

import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

// TODO: Improve it once Drizzle ORM has a better support for ESM & TypeScript
// import { MIGRATIONS_DIR_NAME } from "./lib/migration.js";

// FIXME: Temporary solution, look at the note on the top of this file.
dotenv.config({
	path: "../../.env",
});

export default {
	dbCredentials: {
		user: process.env["DB_USER"] as string,
		password: process.env["DB_PASSWORD"] as string,
		host: process.env["DB_HOSTNAME"] as string,
		port: Number(process.env["DB_PORT"]),
		database: process.env["DB_NAME"] as string,
	},
	driver: "pg",
	// TODO: Improve it once Drizzle ORM has a better support for ESM & TypeScript
	// out: path.join(".", MIGRATIONS_DIR_NAME),
	out: path.join("./migrations"),
	// TODO: Improve it once Drizzle ORM has a better support for ESM & TypeScript
	schema: [
		"./lib/table/index.js",
		"./lib/table/relations.js",
		"./lib/table/enums.js",
		"./lib/table/**/index.js",
	],
	strict: true,
	verbose: true,
} satisfies Config;
