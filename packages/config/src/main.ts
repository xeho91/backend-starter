import {
	log,
	LOG_LEVELS,
	type LogLevel,
	setLoggerLevel,
} from "@packages/logger";
import convict from "convict";
import validator from "convict-format-with-validator";

import { loadDotenv } from "./dotenv.js";

convict.addFormat(validator.ipaddress);
convict.addFormat(validator.url);

export const ENVIRONMENTS = ["development", "test", "production"] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

export type Config = Awaited<ReturnType<typeof loadConfig>>;

export const CONFIG_SCHEMA = convict({
	debug: {
		doc: "Enable debugging mode.",
		format: Boolean,
		default: false,
		env: "DEBUG",
		arg: "debug",
	},

	env: {
		doc: "The project environment.",
		format: ENVIRONMENTS,
		default: "development",
		env: "NODE_ENV",
		arg: "env",
	} as convict.SchemaObj<Environment>,

	log: {
		doc: "Log output level.",
		format: LOG_LEVELS,
		default: "silent",
		env: "LOG",
		arg: "log",
	} as convict.SchemaObj<LogLevel>,


});

/** load the project configuration. */
export async function loadConfig() {
	await loadDotenv();

	setLoggerLevel(CONFIG_SCHEMA.get("log"));

	log.trace(`Validating the project configuration...`);
	CONFIG_SCHEMA.validate({ allowed: "warn" });
	log.debug(
		{ config: CONFIG_SCHEMA },
		`The project project configuration is valid`,
	);

	return CONFIG_SCHEMA;
}

/**
 * Parse **security-sensitive** variable, don't let it be empty.
 * @param value - forwarded value
 */
function parseSensitive(value: unknown) {
	const stringified = String(value);

	if (stringified) {
		return stringified;
	} else {
		throw new Error("Empty string!");
	}
}
