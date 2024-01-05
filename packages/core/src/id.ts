import crypto from "node:crypto";

import { uuid } from "drizzle-orm/pg-core/columns/uuid";
import { z } from "zod";

export class Uuid {
	public static SCHEMA = z.string().uuid();
	public static PG_SCHEMA = uuid("id").defaultRandom();

	public static isValid(value: unknown): value is string {
		return this.SCHEMA.safeParse(value).success;
	}

	public static generate() {
		return crypto.randomUUID();
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	public value: string;

	constructor(value?: string) {
		this.value = value ? Uuid.SCHEMA.parse(value) : Uuid.generate();
	}
}

Uuid.isValid("lol");
