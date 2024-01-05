import { timestamp } from "drizzle-orm/pg-core/columns/timestamp";
import { z } from "zod";

export class Timestamp {
	public static SCHEMA = z.date({ coerce: true });

	public static isValid(value: unknown): value is Date {
		return this.SCHEMA.safeParse(value).success;
	}

	public static current() {
		return new this(new Date());
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	/**
	 * This helps to ensure every table in this project uses the same **timestamps**.
	 */
	public static PG_SCHEMAS = {
		created_at: timestamp("created_at").notNull().defaultNow(),
		// TODO: Implement auto-update, when available
		// Reference: https://github.com/drizzle-team/drizzle-orm/issues/956#issuecomment-1732327425
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	};

	public value: Date;

	constructor(value: Date | string) {
		this.value = Timestamp.SCHEMA.parse(value);
	}
}
