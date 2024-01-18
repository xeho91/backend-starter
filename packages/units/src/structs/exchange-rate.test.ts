import { describe, it } from "vitest";
import { ZodError } from "zod";

import { Currency } from "../enums/currency.js";
import { ExchangeRate } from "./exchange-rate.js";

describe("ExchangeRate", () => {
	describe("new(input)", () => {
		it("throws error when provided input doesn't match the schema", ({
			expect,
		}) => {
			expect(
				() =>
					new ExchangeRate({
						from: "USD",
						// @ts-expect-error Testing
						to: "USD",
						value: 0.99,
					}),
			).toThrowError(ZodError);
		});
	});

	describe("it succeed and:", () => {
		const exchangeRate = new ExchangeRate({
			from: "USD",
			to: "NZD",
			value: 0,
		});

		it("has field 'from' with Currency", ({ expect }) => {
			expect(exchangeRate.from).toBeInstanceOf(Currency);
			expect(exchangeRate.from.valueOf()).toBe("USD");
		});

		it("has field 'to' with Currency", ({ expect }) => {
			expect(exchangeRate.to).toBeInstanceOf(Currency);
			expect(exchangeRate.to.valueOf()).toBe("NZD");
		});

		it("returns number value when accessing `valueOf()`", ({ expect }) => {
			expect(exchangeRate.valueOf()).toBe(0);
		});
	});
});
