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

export const ENVIRONMENTS = ["production", "development", "test"] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

export type Config = Awaited<ReturnType<typeof loadConfig>>;

/** load the project configuration. */
export async function loadConfig() {
	await loadDotenv();

	const config = convict({
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

	setLoggerLevel(config.get("log"));

	log.trace(`Validating the project configuration...`);
	config.validate({ allowed: "warn" });
	log.debug({ config }, `✅ The project project configuration is valid`);

	return config;
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
