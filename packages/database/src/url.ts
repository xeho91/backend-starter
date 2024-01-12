import type { Config } from "@packages/config";
import { log } from "@packages/logger";

import { DB_PROTOCOL } from "./constants.js";

/**
 * Determine the database URL based on the project config.
 * @param config - Project configuration
 */
export function getDatabaseURL(config: Config): URL {
	log.trace("Trying to determine the database URL...");

	const user = config.DB_USER;
	const password = config.DB_PASSWORD.reveal();
	const hostname = config.DB_HOSTNAME;
	const port = config.DB_PORT;
	const name = config.DB_NAME;
	const url = new URL(
		`${DB_PROTOCOL}://${user}:${password}@${hostname}:${port}/${name}`,
	);
	log.debug({ url }, `Database URL`);

	return url;
}
