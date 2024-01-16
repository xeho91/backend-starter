import { describe, it } from "vitest";
import { ZodError } from "zod";

import { Quantity, Stock } from "./stock.js";

describe("Stock", () => {
	describe("new(value)", () => {
		it("throws error when provided value is below allowed min", ({
			expect,
		}) => {
			expect(() => new Stock(Stock.MIN - 1)).toThrowError(ZodError);
		});

		it("throws error when provided value is below allowed max", ({
			expect,
		}) => {
			expect(() => new Stock(Stock.MAX + 1)).toThrowError(ZodError);
		});

		it("success when the value is within allowed range", ({ expect }) => {
			expect(() => new Stock(Stock.MIN + 1)).not.toThrowError(ZodError);
			expect(() => new Stock(Stock.MAX - 1)).not.toThrowError(ZodError);
		});
	});

	describe("take(quantity)", () => {
		it("throws error when trying to take quantity of more than the actual stock value", ({
			expect,
		}) => {
			const stock = new Stock(100);
			const quantity = new Quantity(stock.valueOf() + 1);

			expect(() => stock.take(quantity)).toThrowError(ZodError);
		});

		it("success when trying to take quantity which is the current stock value", ({
			expect,
		}) => {
			const stock = new Stock(100);
			const quantity = new Quantity(stock.valueOf());

			expect(() => stock.take(quantity)).not.toThrowError(ZodError);
		});

		it("success when trying to take quantity which is less than the stock value", ({
			expect,
		}) => {
			const stock = new Stock(100);
			const quantity = new Quantity(stock.valueOf() - 1);

			expect(() => stock.take(quantity)).not.toThrowError(ZodError);
		});
	});
});

describe("Quantity", () => {
	describe("new(value)", () => {
		it("throws error when provided value is below allowed min", ({
			expect,
		}) => {
			expect(() => new Quantity(Quantity.MIN - 1)).toThrowError(ZodError);
		});

		it("throws error when provided value is below allowed max", ({
			expect,
		}) => {
			expect(() => new Quantity(Quantity.MAX + 1)).toThrowError(ZodError);
		});
	});
});
