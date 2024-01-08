import { log } from "@packages/logger";
import { PostgresError } from "postgres";
import { ZodError, type ZodIssue } from "zod";

import { Table } from "./table";

// TODO: Tracker for DrizzleORM error handling feature:
// https://github.com/drizzle-team/drizzle-orm/issues/376

const ERROR_CODES = {
	noRelations: "NO_RELATIONS",
	noConnection: "NO_CONNECTION",
	invalidQueryDataReceived: "INVALID_QUERY_DATA_RECEIVED",
	invalidSchema: "INVALID_SCHEMA",
	notFound: "NOT_FOUND",
	notUnique: "NOT_UNIQUE",
} as const;
type DatabaseErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

type ErrorDetails =
	| ConnectionError
	| PostgresError
	| Array<PostgresIssue | ZodIssue>;

type PostgresIssue = {
	table: ReturnType<(typeof Table)["get"]>;
	message: PostgresError["detail"];
};

interface DatabaseErrorData {
	message: string;
	code: DatabaseErrorCode;
	details?: ErrorDetails;
}

export class DatabaseError extends Error {
	public static code = ERROR_CODES;

	static fromPostgres(error: PostgresError) {
		log.trace({ error }, `Handling PostgresError...`);

		// TODO: Add more when they occur
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (error.code) {
			case "23505": {
				throw new DatabaseError({
					code: DatabaseError.code.notUnique,
					message: error.message,
					details: [
						{
							table: Table.getFromPostgresError(error),
							message: error.detail,
						},
					],
				});
			}
			case "42P01": {
				throw new DatabaseError({
					code: DatabaseError.code.noRelations,
					message:
						"The current state of the migration in the database might not be up to date.",
					details: error,
				});
			}
			default: {
				log.fatal(error);
				throw new TypeError(
					`Unhandled postgres error (code: ${error.code}) has occured!`,
				);
			}
		}
	}

	static fromZod(error: ZodError) {
		const { issues, message } = error;

		return new DatabaseError({
			code: DatabaseError.code.invalidSchema,
			message,
			details: issues,
		});
	}

	public readonly code: DatabaseErrorCode;
	public readonly table: ReturnType<(typeof Table)["get"]> | undefined;
	public readonly details: ErrorDetails | undefined;

	constructor(data: DatabaseErrorData) {
		const { code, details, message } = data;

		super(message);
		Error.captureStackTrace(this, DatabaseError);

		this.code = code;
		this.details = details;
	}

	payload() {
		return {
			message: this.message,
			code: this.code,
			details: this.details,
		};
	}
}

/**
 * Set the error to throw during the failed attempt of a database query.
 * @param error - error received from the catch
 */
export function createDatabaseError(error: unknown): DatabaseError {
	log.trace({ error }, "Trying to determine the database error...");

	if (error instanceof DatabaseError) {
		throw error;
	} else if (error instanceof PostgresError) {
		throw DatabaseError.fromPostgres(error);
	} else if (error instanceof ZodError) {
		throw DatabaseError.fromZod(error);
	} else if (isConnectionError(error)) {
		log.fatal(error);
		throw new DatabaseError({
			code: DatabaseError.code.noConnection,
			message:
				"System couldn't establish a connection with the database.",
			details: error,
		});
	} else {
		log.fatal({ error }, "An unhandled error occured on the database!");
		throw error;
	}
}

interface ConnectionError {
	errno: number;
	code: "ECONNREFUSED";
	syscall: string;
	address: string;
	port: number;
}

function isConnectionError(error: unknown): error is ConnectionError {
	return typeof error === "object" && error && "code" in error
		? error.code === "ECONNREFUSED"
		: false;
}
