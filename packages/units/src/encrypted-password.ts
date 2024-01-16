import { log } from "@packages/logger";
import bcrypt from "bcrypt";
import { z } from "zod";

import type { Password } from "./password.js";
import type { Struct } from "./types.d.ts";

type Value =
	`${(typeof EncryptedPassword)["HASH_ALGORITHM_IDENTIFIER"]}$${(typeof EncryptedPassword)["SALT_ROUNDS"]}$${string}`;

export class EncryptedPassword implements Struct<Value> {
	/**
	 * Length of the hashed password.
	 * @see {@link https://blog.logrocket.com/password-hashing-node-js-bcrypt#node-js-bcyrpt-password-hashing-information}
	 */
	public static LENGTH = 60 as const;

	/**
	 * Optimal password hashing cost.
	 * WARN: Do not set longer than 10 if we don't want to exceed 100ms.
	 * @see {@link https://blog.logrocket.com/password-hashing-node-js-bcrypt#password-hashing-data-costs}
	 */
	public static SALT_ROUNDS = 10 as const;

	/**
	 * Bcrypt hash algorithm identifier.
	 * @see {@link https://www.npmjs.com/package/bcrypt#hash-info}
	 */
	public static HASH_ALGORITHM_IDENTIFIER = "2b" as const;

	/** Schema for the _(powered by `zod`)_ encrypted password, to ensure that encryption worked as expected. */
	public static SCHEMA = z
		.string()
		.length(this.LENGTH)
		.startsWith(`$${this.HASH_ALGORITHM_IDENTIFIER}$${this.SALT_ROUNDS}$`);
	public static extendedSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	/**
	 * Quickly check if the provided value meets encrypted the password schema.
	 * @param value - the value to check
	 */
	public static isValid(value: unknown): value is Value {
		return this.SCHEMA.safeParse(value).success;
	}

	/**
	 * Create encrypted password from a password.
	 * @param password - supported instance
	 * @see {@link Password}
	 */
	public static async from(password: Password): Promise<EncryptedPassword> {
		try {
			const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
			const encrypted = await bcrypt.hash(password.reveal(), salt);

			return new this(encrypted);
		} catch (error) {
			log.fatal({ error }, "There was an issue with hashing a password!");
			throw error;
		}
	}

	#value: Value;

	constructor(value: Value | string) {
		this.#value = EncryptedPassword.SCHEMA.parse(value) as Value;
	}

	/**
	 * Check if the encrypted password is a match with a non-encrypted one.
	 * @param password - non-encrypted password to compare with
	 */
	public async isMatch(password: Password): Promise<boolean> {
		try {
			return await bcrypt.compare(password.reveal(), this.#value);
		} catch (error) {
			log.fatal({ error }, "There was an issue with comparison!");
			throw error;
		}
	}

	public toString() {
		return this.#value;
	}

	public valueOf() {
		return this.#value;
	}
}
