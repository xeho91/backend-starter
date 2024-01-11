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

	private static NUMERIC_SCHEMA = z
		.number({ coerce: true })
		.min(this.MIN)
		.max(this.MAX);
	public static SCHEMA = z
		.tuple([this.NUMERIC_SCHEMA, Currency.SCHEMA])
		.or(this.NUMERIC_SCHEMA);

	public static isValid(value: unknown): value is [number, CurrencyType] {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((value) => {
			if (Array.isArray(value)) {
				const [price, currency] = value;

				return new this(price, currency);
			} else {
				return new this(value);
			}
		}).or(z.instanceof(this));
	}

	public currency: Currency;
	public value: number;

	constructor(price: number, currency: CurrencyType = Currency.DEFAULT) {
		const parsed = Price.SCHEMA.parse([price, currency]);

		if (Array.isArray(parsed)) {
			const [pPrice, pCurrency] = parsed;

			this.value = pPrice;
			this.currency = new Currency(pCurrency);
		} else {
			this.value = parsed;
			this.currency = new Currency(currency);
		}
	}

	public toString() {
		return this.value.toString();
	}

	public valueOf() {
		return this.value;
	}

	get display() {
		return `${this.currency} ${this.value}`;
	}
}
