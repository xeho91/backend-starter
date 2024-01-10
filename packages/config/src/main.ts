import { Name } from "@packages/core/name";
import { Password } from "@packages/core/password";
import { log, LOG_LEVELS, setLoggerLevel } from "@packages/logger";
import { parseEnv, type Schemas } from "znv";
import { z } from "zod";

import { loadDotenv } from "./dotenv.js";

export const ENVIRONMENTS = ["development", "test", "production"] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

/** @see {@link CONFIG_SCHEMA} */
export type EnvironmentVariable = keyof typeof CONFIG_SCHEMA;

export const CONFIG_SCHEMA = {
	// General
	DEBUG: z
		.boolean({
			description: "Enable debugging mode.",
		})
		.default(false),

	LOG: z
		.enum(LOG_LEVELS, {
			description: "Log output level.",
			invalid_type_error: "Kurwa",
		})
		.default("silent"),

	NODE_ENV: z
		.enum(ENVIRONMENTS, { description: "The project environment." })
		.default("development"),

	// Database
	DB_USER: z
		.string({
			description: "Database user for authentication.",
		})
		.transform((v) => new Name(v)),
	DB_PASSWORD: z
		.string({
			description: "Database password for authentication.",
		})
		.transform((v) => new Password(v)),
	DB_HOSTNAME: z
		.string({
			description: "Database hostname.",
		})
		.ip({ version: "v4" })
		.default("0.0.0.0"),
	DB_PORT: z
		.number({ coerce: true, description: "Database port to listen." })
		.min(1024)
		.max(65_535)
		.default(5432),
	DB_NAME: z
		.string({
			description: "Database name.",
		})
		.default("sample")
		.transform((v) => new Name(v)),
} satisfies Schemas;

export type Config = ReturnType<typeof parseEnv<typeof CONFIG_SCHEMA>>;

/** load the project configuration. */
export async function loadConfig(): Promise<Config> {
	await loadDotenv();

	log.trace(
		`Validating the project configuration via environment variables...`,
	);
	const config = parseEnv(process.env, CONFIG_SCHEMA);

	setLoggerLevel(config.LOG);

	log.debug({ config }, `The project project configuration is valid`);
	return config;
}
