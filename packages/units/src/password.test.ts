import { faker } from "@faker-js/faker";
import { describe, it } from "vitest";
import { ZodError } from "zod";

import { Password } from "./password.js";

const VALID_PASSWORD = "SuperSecretPassword@1337";
const INVALID_PASSWORD = "secret";

describe("Password", () => {
	describe("static isValid(value)", () => {
		it("returns false when value is invalid", ({ expect }) => {
			expect(Password.isValid(INVALID_PASSWORD)).toBe(false);
		});

		it("returns true when value is valid", ({ expect }) => {
			expect(Password.isValid(VALID_PASSWORD)).toBe(true);
		});
	});

	describe("static new(value)", () => {
		describe("throws error when:", () => {
			it("value is too short", ({ expect }) => {
				const value = faker.internet.password({
					length: Password.MIN - 1,
				});

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("value is too long", ({ expect }) => {
				const value = Array.from(
					{ length: Password.MAX + 1 },
					() => "1",
				).join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("value doesn't have lowercase character", ({ expect }) => {
				const value = Array.from({ length: 20 }, () => "!1A").join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("value doesn't have uppercase character", ({ expect }) => {
				const password = Array.from({ length: 20 }, () => "!1b").join(
					"",
				);

				expect(() => new Password(password)).toThrowError(ZodError);
			});

			it("value doesn't have number", ({ expect }) => {
				const value = Array.from({ length: 20 }, () => "!Ab").join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});

			it("value doesn't have special character", ({ expect }) => {
				const value = Array.from({ length: 20 }, () => "1Ab").join("");

				expect(() => new Password(value)).toThrowError(ZodError);
			});
		});

		it("success when value is valid", ({ expect }) => {
			expect(() => Password.random()).not.toThrowError(ZodError);
		});
	});
});
