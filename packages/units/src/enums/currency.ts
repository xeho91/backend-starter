import { z } from "zod";

import type { Enum } from "../types.js";

export class Currency<T extends CurrencyType = (typeof Currency)["DEFAULT"]>
	implements Enum<CurrencyType>
{
	/** Default value for this enum. */
	public static DEFAULT = "TWD" as const satisfies CurrencyType;

	/** Available currencies in the project. */
	public static ENUM = ["AUD", "EUR", "PLN", "TWD", "USD", "NZD"] as const;

	/** Zod default _(without transformation)_ schema, to parse **without** instance. */
	public static schema() {
		return z.enum(this.ENUM);
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(value: unknown): value is CurrencyType {
		return this.schema().safeParse(value).success;
	}

	/** Zod extended _(with transformation)_ schema, to parse **with** instance. */
	public static extendedSchema() {
		return this.schema()
			.transform((v) => new this(v))
			.or(z.instanceof(this));
	}

	#value: CurrencyType;

	constructor(value: T = Currency.DEFAULT as T) {
		this.#value = Currency.schema().parse(value);
	}

	public is<C extends CurrencyType>(
		currency: C | Currency<C>,
	): this is Currency<C> {
		return this.#value === Currency.extendedSchema().parse(currency).#value;
	}

	public change<N extends CurrencyType>(currency: N) {
		return new Currency<N>(
			Currency.schema().exclude([this.#value]).parse(currency),
		);
	}

	public toString() {
		return this.#value;
	}

	public valueOf() {
		return this.#value;
	}
}

export type CurrencyType = (typeof Currency)["ENUM"][number];
