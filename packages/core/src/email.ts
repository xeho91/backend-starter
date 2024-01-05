import { varchar } from "drizzle-orm/pg-core/columns";
import { z } from "zod";

export class Email {
	public static MAX = 255;

	public static SCHEMA = z.string().email().max(this.MAX);
	public static PG_SCHEMA = varchar("email", { length: this.MAX });

	public static isValid(value: unknown): value is string {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	public value: string;

	constructor(value: string) {
		this.value = Email.SCHEMA.parse(value);
	}
}
