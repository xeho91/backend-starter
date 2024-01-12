import { type Config } from "@packages/config";
import type postgres from "postgres";

import { getDatabaseURL } from "./url.js";

/**
 * Get **shared** PostgresJS options.
 * @see {@link https://github.com/porsager/postgres#all-postgres-options}
 * @param config - Project configuration
 */
export function getPostgresOptions(config: Config) {
	const { hostname, password, pathname, port, username } =
		getDatabaseURL(config);

	return {
		debug: ["trace", "debug"].includes(config.LOG),
		user: username,
		password,
		hostname,
		port: Number(port),
		// NOTE: Removes the leading `/` from the pathname
		database: pathname.slice(1),
	} satisfies Parameters<typeof postgres>[1];
}
