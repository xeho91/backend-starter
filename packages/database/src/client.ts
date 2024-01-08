import type { Config } from "@packages/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDrizzleOptions } from "./drizzle.js";
import { getPostgresOptions } from "./postgres.js";

/**
 * Get database client to use for **queries**.
 * @see {@link https://orm.drizzle.team/docs/quick-postgresql/postgresjs}
 * @param config - Project configuration
 */
export function getQueryClient(config: Config) {
	return drizzle(postgres({ ...getPostgresOptions(config) }), {
		...getDrizzleOptions(),
	});
}
