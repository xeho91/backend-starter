import { z } from "zod";

import { Currency, type CurrencyValue } from "../enums/currency.js";
import type { Struct } from "../types.d.ts";

export type ExchangeRateValue<
	From extends CurrencyValue,
	To extends Exclude<CurrencyValue, From>,
> = {
	from: From | Currency<From>;
	to: To | Currency<To>;
	value: number | string;
};
export type ExchangeRateType<
	From extends CurrencyValue,
	To extends Exclude<CurrencyValue, From>,
> = ExchangeRateValue<From, To> | ExchangeRate<From, To>;

export class ExchangeRate<
	From extends CurrencyValue,
	To extends Exclude<CurrencyValue, From>,
> implements Struct<number>
{
	/**
	 * Zod default _(without transformation)_ schema, to parse **without** instance.
	 * @param from - value to exclude in `to` field
	 */
	public static schema(from: CurrencyValue) {
		return z.object({
			from: Currency.extendedSchema(),
			to: Currency.extendedSchema(from),
			value: z.number({ coerce: true }),
		});
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(
		value: unknown,
	): value is ExchangeRateType<CurrencyValue, never> {
		return typeof value === "object" &&
			value &&
			"from" in value &&
			Currency.isValid(value.from)
			? this.schema(value.from).safeParse(value).success
			: false;
	}

	/**
	 * Zod extended _(with transformation)_ schema, to parse **with** instance.
	 * @param from - value to exclude in `to` field
	 */
	public static extendedSchema(from: CurrencyValue) {
		return this.schema(from)
			.transform((v) => new this(v))
			.or(z.instanceof(this));
	}

	public from: Currency<From>;
	public to: Currency<To>;

	#value: number;

	constructor(input: ExchangeRateType<From, To>) {
		const { from, to, value } = ExchangeRate.schema(
			input.from.toString() as From,
		).parse(input);

		this.from = from;
		this.to = to;
		this.#value = value;
	}

	public toString() {
		return this.#value.toString();
	}

	public valueOf() {
		return this.#value;
	}
}
