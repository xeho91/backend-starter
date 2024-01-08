import { z } from "zod";

import { Currency, type CurrencyType } from "./currency.js";

/**
 * This class helps to ensure every table in this project uses the same **price** builder.
 *
 * For the choice of data type, see below reference:
 * https://stackoverflow.com/a/224866/6753652
 */
export class Price {
	public static MIN = 10;
	public static MAX = 10_000_000;
	public static PRECISION = 19;
	public static SCALE = 4;

	public static SCHEMA = z.tuple([
		z.number({ coerce: true }).min(this.MIN).max(this.MAX),
		Currency.SCHEMA,
	]);

	public static isValid(value: unknown): value is [number, CurrencyType] {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	public currency: Currency;
	public value: number;

	constructor(price: [number, CurrencyType]) {
		const [value, currency] = Price.SCHEMA.parse(price);

		this.value = value;
		this.currency = new Currency(currency);
	}

	public toString() {
		return `${this.value} ${this.currency}`;
	}
}
