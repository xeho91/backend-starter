import type { Config } from "@packages/config";
import { log } from "@packages/logger";

import { DB_PROTOCOL } from "./constants.js";

/**
 * Determine the database URL based on the project config.
 * @param config - Project configuration
 */
export function getDatabaseURL(config: Config): URL {
	log.trace("Trying to determine the database URL...");

	const user = config.get("database.user");
	const password = config.get("database.password");
	const hostname = config.get("database.hostname");
	const port = config.get("database.port");
	const name = config.get("database.name");
	const url = new URL(
		`${DB_PROTOCOL}://${user}:${password}@${hostname}:${port}/${name}`,
	);
	log.debug({ url }, `Database URL`);

	return url;
}
