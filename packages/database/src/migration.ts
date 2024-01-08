import path from "node:path";

import type { Config } from "@packages/config";
import { log } from "@packages/logger";
import { findPackageRootPath } from "@packages/path/packages";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { getDrizzleOptions } from "./drizzle.js";
import { createDatabaseError } from "./error.js";
import { getPostgresOptions } from "./postgres.js";

/** Directory name for database migrations files */
export const DB_MIGRATIONS_DIR_NAME = "migrations";

/** Get the absolute path for database migrations files directory. */
export async function getDatabaseMigrationsDirectory() {
	return path.join(
		await findPackageRootPath("database"),
		DB_MIGRATIONS_DIR_NAME,
	);
}

/**
 * Run database migrations on pre-configured client for it,
 * @param config - Project configuration
 * @throws When:
 * 1. Couldn't establish a connection to the database,
 * 2. Running migrations failed.
 */
export async function runDatabaseMigrations(config: Config) {
	try {
		log.info("Running database migrations...");
		await migrate(
			drizzle(
				postgres({
					...getPostgresOptions(config),
					max: 1,
				}),
				{ ...getDrizzleOptions() },
			),
			{
				migrationsFolder: await getDatabaseMigrationsDirectory(),
			},
		);
		log.info("Database migrations succeed.");
	} catch (error) {
		log.fatal({ error }, "Failed to run database migrations.");
		throw createDatabaseError(error);
	}
}
