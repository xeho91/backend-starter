import { describe, it } from "vitest";
import { ZodError } from "zod";

import { EncryptedPassword } from "./encrypted-password.js";
import { Password } from "./password.js";

describe("EncryptedPassword", () => {
	const timeout = 100;

	describe("from(password)", async () => {
		describe(
			`it succeed when password is valid, doesn't last longer than ${timeout}ms, and:`,
			async () => {
				const password = Password.random();
				const encrypted = await EncryptedPassword.from(password);

				it(`encrypted password is a string with ${EncryptedPassword.LENGTH} characters length`, ({
					expect,
				}) => {
					expect(encrypted.toString()).toBeTypeOf("string");
					expect(encrypted.toString()).toHaveLength(
						EncryptedPassword.LENGTH,
					);
				});

				it(`encrypted password info includes bcrypt hashing algorithm identifier ("${EncryptedPassword.HASH_ALGORITHM_IDENTIFIER}") and the salt rounds (${EncryptedPassword.SALT_ROUNDS})`, ({
					expect,
				}) => {
					expect(encrypted.toString()).toMatch(
						new RegExp(
							`^\\$${EncryptedPassword.HASH_ALGORITHM_IDENTIFIER}\\$${EncryptedPassword.SALT_ROUNDS}\\$+`,
						),
					);
				});
			},
			{ timeout },
		);
	});

	describe("isMatch(password)", () => {
		describe(`succeed and doesn't last longer than ${timeout}ms:`, () => {
			it(
				"returns true when encrypted password is a match with a non-encrypted password",
				async ({ expect }) => {
					const password = new Password("SuperSecretPassword@1337");
					const encrypted = new EncryptedPassword(
						"$2b$10$dNc1x.eACwIgijSBm.WtR.jTWu7OzFU0N6zWBFn6JLRBBKspkNzCa",
					);

					await expect(encrypted.isMatch(password)).resolves.toBe(
						true,
					);
				},
				{ timeout },
			);

			it(
				"returns false when password is NOT a match with encrypted",
				async ({ expect }) => {
					// NOTE: This is some random from bcrypt `README.md`
					const password = Password.random();
					const encrypted = new EncryptedPassword(
						"$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa",
					);

					await expect(encrypted.isMatch(password)).resolves.toBe(
						false,
					);
				},
				{ timeout },
			);
		});
	});

	describe("static isValid(value)", () => {
		it("returns false when value is invalid", ({ expect }) => {
			expect(
				EncryptedPassword.isValid(
					"asdads10230130123-1-2301230120312-31203-0123-1",
				),
			).toBe(false);
		});

		it("returns true when value is valid", ({ expect }) => {
			expect(
				EncryptedPassword.isValid(
					"$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa",
				),
			).toBe(true);
		});
	});

	describe("static from(Password)", () => {
		it("sucessfully creates self from the Password instance", ({
			expect,
		}) => {
			const password = Password.random();

			expect(EncryptedPassword.from(password)).resolves.not.toThrowError(
				ZodError,
			);
		});
	});
});
