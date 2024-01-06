import crypto from "node:crypto";

import type { Join, Split } from "type-fest";
import { z } from "zod";

type Value = [string, string, `4${string}`, `y${string}`, string];
type Stringified = Join<Value, "-">;
type Splitted = Split<Stringified, "-">;

export class Uuid {
	public static SCHEMA = z.string().uuid();

	public static isValid(value: unknown): value is Stringified {
		return this.SCHEMA.safeParse(value).success;
	}

	public static generate() {
		return new this(crypto.randomUUID());
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	public static from(value: Stringified | string) {
		return new this(value);
	}

	protected value: Value;

	constructor(value: Stringified | string) {
		this.value = Uuid.SCHEMA.parse(value).split("-") as Splitted;
	}

	public toString() {
		return this.value.join("-") as Stringified;
	}

	public valueOf() {
		return this.toString();
	}
}
