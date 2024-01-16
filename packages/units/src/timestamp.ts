import { z } from "zod";

import type { Struct } from "./types.d.ts";

export class Timestamp implements Struct<Date> {
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

	protected value: Date;

	constructor(value: Date | string) {
		this.value = Timestamp.SCHEMA.parse(value);
	}

	public toString() {
		return this.value.toString();
	}

	public valueOf() {
		return this.value;
	}
}
