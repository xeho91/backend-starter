import type { Join, Split } from "type-fest";
import { z } from "zod";

export type Value = [string, string];
export type Stringified = Join<Value, "@">;
export type Splitted = Split<Stringified, "@">;

export class Email {
	public static MAX = 255;

	public static SCHEMA = z.string().email().max(this.MAX);

	public static isValid(value: unknown): value is Stringified {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	public localPart: string;
	public domain: string;

	constructor(value: Stringified | string) {
		const [localPart, domain] = Email.SCHEMA.parse(value).split(
			"@",
		) as Splitted;

		this.localPart = localPart;
		this.domain = domain;
	}

	public toString(): Stringified {
		return `${this.localPart}@${this.domain}`;
	}

	public valueOf() {
		return this.toString();
	}
}
