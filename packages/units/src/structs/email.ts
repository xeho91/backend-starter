import type { Join, Split } from "type-fest";
import { z } from "zod";

import type { Struct } from "../types.d.ts";

type Value = [string, string];
export type StringifiedEmail = Join<Value, "@">;
type Splitted = Split<StringifiedEmail, "@">;

export type EmailType = Email | StringifiedEmail;

export class Email implements Struct<StringifiedEmail> {
	public static MAX = 255 as const;

	/** Zod default _(without transformation)_ schema, to parse **without** instance. */
	public static schema() {
		return z.string().email().max(this.MAX);
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(value: unknown): value is StringifiedEmail {
		return this.schema().safeParse(value).success;
	}

	/** Zod extended _(with transformation)_ schema, to parse **with** instance. */
	public static extendedSchema() {
		return this.schema()
			.transform((v) => new this(v as StringifiedEmail))
			.or(z.instanceof(this));
	}

	/**
	 * **Part that comes before the `"@"` symbol.**
	 *
	 * It identifies the recipient's mailbox and can contain alphanumeric characters,
	 * as well as special characters such as `"."`, `"-"`, and `"_"`,
	 * but it cannot begin or end with a special character,
	 * and **it cannot contain two consecutive special characters**.
	 *
	 * The local-part can also include non-ASCII characters,
	 * but they must be encoded using the UTF-8 character set.
	 *
	 * The length of the local-part is limited to `64` characters
	 * according to the original specification for SMTP email delivery, RFC 821.
	 *
	 * The local-part is case-sensitive, except for the `"postmaster"` account,
	 * which is required to be deliverable.
	 * @see {@link https://en.wikipedia.org/wiki/Email_address}
	 */
	public localPart: string;

	/**
	 * **Part that comes after the `"@"` symbol.**
	 *
	 * **It usually refers to the name of the organization or company
	 * that owns the email address and is often the same as the domain name.**
	 *
	 * The email domain is associated with a specific mail server,
	 * and it functions like a virtual street name
	 * that lets your email get delivered to the right address.
	 * @see {@link https://en.wikipedia.org/wiki/Email_address}
	 */
	public domain: string;

	constructor(value: StringifiedEmail | string) {
		const [localPart, domain] = Email.schema()
			.parse(value)
			.split("@") as Splitted;

		this.localPart = localPart;
		this.domain = domain;
	}

	public toString(): StringifiedEmail {
		return `${this.localPart}@${this.domain}`;
	}

	public valueOf() {
		return this.toString();
	}
}
