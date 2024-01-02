import pino from "pino";
import pretty from "pino-pretty";

/** Available log levels enum */
export const LOG_LEVELS = [
	"trace",
	"debug",
	"info",
	"warn",
	"error",
	"fatal",
	"silent",
] as const;

/** @see {@link LOG_LEVELS} */
export type LogLevel = (typeof LOG_LEVELS)[number];

export const LOG_ENV_VAR_NAME = "LOG";
export const LOG_DEFAULT_LEVEL = "silent" satisfies LogLevel;

export const log = pino(
	{
		level: (process.env[LOG_ENV_VAR_NAME] || LOG_DEFAULT_LEVEL) as LogLevel,
	},
	pretty({
		colorize: true,
		levelFirst: true,
	}),
);

export function setLoggerLevel(level: LogLevel) {
	if (level !== "silent") {
		// eslint-disable-next-line no-console
		console.log(`Logger level is set to: ${level}`);
	}

	log.level = level;
}