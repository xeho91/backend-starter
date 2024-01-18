import { faker } from "@faker-js/faker";
import { getRandomInteger } from "@packages/utils/random";
import { z } from "zod";

import type { Struct } from "../types.js";

export type PasswordType = Password | string;

export class Password implements Struct<string> {
	/** @see {@link https://bitwarden.com/blog/how-long-should-my-password-be} */
	public static MIN = 16 as const;
	/** @see {@link https://bitwarden.com/blog/how-long-should-my-password-be} */
	public static MAX = 128 as const;

	/** Schema _(powered by `zod`)_ for the password. */
	public static SCHEMA = z
		.string()
		.min(this.MIN)
		.max(this.MAX)
		.regex(
			/.*[A-Z].*/,
			"Password must contain atleast one uppercase character",
		)
		.regex(
			/.*[a-z].*/,
			"Password must contain atleast one lowercase character",
		)
		.regex(/.*\d.*/, "Password must contain atleast one number")
		.regex(
			/.*[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-].*/,
			"Password must contain at least one special character",
		);

	/**
	 * Quickly check if the provided value meets the password schema.
	 * @param value - the value to check
	 */
	static isValid(value: unknown): value is string {
		return this.SCHEMA.safeParse(value).success;
	}

	public static extendedSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	/**
	 * Generate a random password with `faker`.
	 * NOTE: Every generated password will have a prefix "Aut0!"
	 */
	static random(): Password {
		const value = faker.internet.password({
			length: getRandomInteger({ min: this.MIN, max: this.MAX }),
			memorable: false,
			prefix: "Aut0!",
		});

		return new this(value);
	}

	#value: string;

	constructor(value: string) {
		this.#value = Password.SCHEMA.parse(value);
	}

	/** WARN: Dangerous action! */
	public reveal() {
		return this.#value;
	}

	public toString() {
		return "*".repeat(this.#value.length);
	}

	public valueOf() {
		return this.toString();
	}
}
