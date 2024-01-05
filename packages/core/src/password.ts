import { faker } from "@faker-js/faker";
import { log } from "@packages/logger";
import { getRandomInteger } from "@packages/utils/random";
import bcrypt from "bcrypt";
import { varchar } from "drizzle-orm/pg-core/columns/varchar";
import { z } from "zod";

export class Password {
	/** @see {@link https://bitwarden.com/blog/how-long-should-my-password-be} */
	public static MIN = 14;

	/** @see {@link https://bitwarden.com/blog/how-long-should-my-password-be} */
	public static MAX = 128;

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

	public static createSchema() {
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

	/** Quickly hide the password. */
	public hide() {
		return "*".repeat(this.#value.length);
	}

	/**
	 * Check if the password is a match with an encrypted one.
	 * @param encrypted - encrypted password to compare with
	 */
	public async isMatch(encrypted: EncryptedPassword): Promise<boolean> {
		try {
			return await bcrypt.compare(this.#value, encrypted.value);
		} catch (error) {
			log.fatal({ error }, "There was an issue with comparison!");
			throw error;
		}
	}

	/**
	 * Convert self to an encrypted instance.
	 * @see {@link EncryptedPassword}
	 */
	public async encrypt(): Promise<EncryptedPassword> {
		return await EncryptedPassword.from(this);
	}
}

export class EncryptedPassword {
	/**
	 * Length of the hashed password.
	 * @see {@link https://blog.logrocket.com/password-hashing-node-js-bcrypt#node-js-bcyrpt-password-hashing-information}
	 */
	public static LENGTH = 60;

	/**
	 * Optimal password hashing cost.
	 * WARN: Do not set longer than 10 if we don't want to exceed 100ms.
	 * @see {@link https://blog.logrocket.com/password-hashing-node-js-bcrypt#password-hashing-data-costs}
	 */
	public static SALT_ROUNDS = 10;

	/**
	 * Bcrypt hash algorithm identifier.
	 * @see {@link https://www.npmjs.com/package/bcrypt#hash-info}
	 */
	public static HASH_ALGORITHM_IDENTIFIER = "2b";

	/** Schema for the _(powered by `zod`)_ encrypted password, to ensure that encryption worked as expected. */
	public static SCHEMA = z
		.string()
		.length(this.LENGTH)
		.startsWith(`$${this.HASH_ALGORITHM_IDENTIFIER}$${this.SALT_ROUNDS}$`);
	public static PG_SCHEMA = varchar("password", { length: this.LENGTH });

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	/**
	 * Quickly check if the provided value meets encrypted the password schema.
	 * @param value - the value to check
	 */
	public static isValid(value: unknown): value is string {
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

	public value: string;

	constructor(value: string) {
		this.value = EncryptedPassword.SCHEMA.parse(value);
	}

	/**
	 * Check if the encrypted password is a match with a non-encrypted one.
	 * @param password - non-encrypted password to compare with
	 */
	public async isMatch(password: Password): Promise<boolean> {
		return password.isMatch(this);
	}
}
