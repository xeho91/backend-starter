import pino from "pino";
import pretty from "pino-pretty";

/** Available log levels enum */
export const LOG_LEVELS = [
	"silent",
	"fatal",
	"error",
	"warn",
	"info",
	"debug",
	"trace",
] as const;

/** @see {@link LOG_LEVELS} */
export type LogLevel = (typeof LOG_LEVELS)[number];

export const log = pino(
	{
		level: (process.env["LOG"] || "silent") as LogLevel,
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
