import { faker } from "@faker-js/faker";
import { describe, it } from "vitest";
import { ZodError } from "zod";

import { EncryptedPassword, Password } from "./password.js";

const VALID_PASSWORD = "SuperSecretPassword@1337";
const INVALID_PASSWORD = "secret";

describe("Password", () => {
	describe("static isValid(password)", () => {
		it("returns false when password is invalid", ({ expect }) => {
			expect(Password.isValid(INVALID_PASSWORD)).toBe(false);
		});

		it("returns true when password is valid", ({ expect }) => {
			expect(Password.isValid(VALID_PASSWORD)).toBe(true);
		});
	});

	describe("static new(value)", () => {
		describe("throws error when:", () => {
			it("password is too short", ({ expect }) => {
				const value = faker.internet.password({
					length: Password.MIN - 1,
				});

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("password is too long", ({ expect }) => {
				const value = Array.from(
					{ length: Password.MAX + 1 },
					() => "1",
				).join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("password doesn't have lowercase character", ({ expect }) => {
				const value = Array.from({ length: 20 }, () => "!1A").join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("password doesn't have uppercase character", ({ expect }) => {
				const password = Array.from({ length: 20 }, () => "!1b").join(
					"",
				);

				expect(() => new Password(password)).toThrowError(ZodError);
			});

			it("throws error when password doesn't have number", ({
				expect,
			}) => {
				const value = Array.from({ length: 20 }, () => "!Ab").join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("throws error when password doesn't have special character", ({
				expect,
			}) => {
				const value = Array.from({ length: 20 }, () => "1Ab").join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});
		});

		it("success when password is valid", ({ expect }) => {
			expect(() => Password.random()).not.toThrowError(ZodError);
		});
	});

	const timeout = 100;

	describe("encrypt()", async () => {
		describe(
			`it succeed when password is valid, doesn't last longer than ${timeout}ms, and:`,
			async () => {
				const encrypted = await new Password(VALID_PASSWORD).encrypt();

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

		describe("isMatch(encrypted)", () => {
			describe(`succeed and doesn't last longer than ${timeout}ms:`, () => {
				it(
					"returns true when password is a match with encrypted",
					({ expect }) => {
						const password = new Password(VALID_PASSWORD);
						const encrypted = new EncryptedPassword(
							"$2b$10$dNc1x.eACwIgijSBm.WtR.jTWu7OzFU0N6zWBFn6JLRBBKspkNzCa",
						);

						expect(password.isMatch(encrypted)).resolves.toBe(true);
					},
					{ timeout },
				);

				it(
					"returns false when password is NOT a match with encrypted",
					({ expect }) => {
						// NOTE: This is some random from bcrypt `README.md`
						const password = new Password(VALID_PASSWORD);
						const encrypted = new EncryptedPassword(
							"$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa",
						);

						expect(password.isMatch(encrypted)).resolves.toBe(
							false,
						);
					},
					{ timeout },
				);
			});
		});
	});
});

describe("EncryptedPassword", () => {
	describe("static isValid(value)", () => {
		it("returns false when value is invalid", ({ expect }) => {
			expect(EncryptedPassword.isValid(INVALID_PASSWORD)).toBe(false);
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
