import { z } from "zod";

import type { Currency, CurrencyType } from "../enums/currency.js";
import type { Struct } from "../types.d.ts";

interface Input<
	From extends CurrencyType,
	To extends Exclude<CurrencyType, From>,
> {
	from: Currency<From>;
	to: Currency<To>;
	value: number;
}

export class ExchangeRate<
	From extends CurrencyType,
	To extends Exclude<CurrencyType, From>,
> implements Struct<number>
{
	/** Zod default _(without transformation)_ schema, to parse **without** instance. */
	public static schema() {
		return z.number({ coerce: true });
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(value: unknown): value is number {
		return this.schema().safeParse(value).success;
	}

	public from: Currency<From>;
	public to: Currency<To>;

	#value: number;

	constructor(input: Input<From, To>) {
		const { from, to, value } = input;
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
