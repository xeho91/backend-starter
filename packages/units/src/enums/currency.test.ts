import { excludeFromArray } from "@packages/utils/array";
import { describe, it } from "vitest";
import { ZodError } from "zod";

import { Currency, type CurrencyType } from "./currency.js";

describe("Currency", () => {
	describe("is(currency)", () => {
		it("throws error when provided currency is not included in the enum", ({
			expect,
		}) => {
			const currency = new Currency("AUD");
			// @ts-expect-error - Testing
			expect(() => currency.is("GBP")).toThrowError(ZodError);
		});
	});

	describe("success when provided currency is included in the enum and:", () => {
		const current = "AUD";
		const instance = new Currency(current);

		it("returns false when is not the same", ({ expect }) => {
			for (const currency of excludeFromArray(Currency.ENUM, [current])) {
				expect(instance.is(currency)).toBe(false);
			}
		});

		it("returns true when is same", ({ expect }) => {
			expect(instance.is(current)).toBe(true);
		});
	});

	describe("change(currency)", () => {
		it("throws error when provided currency is same as the current one", ({
			expect,
		}) => {
			const currency = new Currency("AUD");
			expect(() => currency.change("AUD")).toThrowError(ZodError);
		});

		it("success when provided currency is NOT same as the current one", ({
			expect,
		}) => {
			const current = "AUD" as const satisfies CurrencyType;
			const instance = new Currency(current);

			for (const currency of excludeFromArray(Currency.ENUM, [current])) {
				expect(() => instance.change(currency)).not.toThrowError(
					ZodError,
				);
			}
		});
	});
});
