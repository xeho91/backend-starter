import { z } from "zod";

import type { Enum } from "../types.js";

export type CurrencyValue = (typeof Currency)["ENUM"][number];
export type CurrencyType = CurrencyValue | Currency;

export class Currency<T extends CurrencyValue = (typeof Currency)["DEFAULT"]>
	implements Enum<CurrencyValue>
{
	/** Default value for this enum. */
	public static DEFAULT = "TWD" as const satisfies CurrencyValue;

	/** Available currencies in the project. */
	public static ENUM = ["AUD", "EUR", "PLN", "TWD", "USD", "NZD"] as const;

	/**
	 * Zod default _(without transformation)_ schema, to parse **without** instance.
	 * @param exclude - optional exclusion value, useful when you want to create two schemas from same enum type
	 */
	public static schema(exclude?: CurrencyValue) {
		const schema = z.enum(this.ENUM);

		return exclude ? schema.exclude([exclude]) : schema;
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(value: unknown): value is CurrencyValue {
		return this.schema().safeParse(value).success;
	}

	/**
	 * Zod extended _(with transformation)_ schema, to parse **with** instance.
	 * @param exclude - optional exclusion value, useful when you want to create two schemas from same enum type
	 */
	public static extendedSchema(exclude?: CurrencyValue) {
		return this.schema(exclude)
			.transform((v) => new this(v))
			.or(z.instanceof(this));
	}

	#value: CurrencyValue;

	constructor(value: T = Currency.DEFAULT as T) {
		this.#value = Currency.schema().parse(value);
	}

	public is<C extends CurrencyValue>(
		currency: C | Currency<C>,
	): this is Currency<C> {
		return this.#value === Currency.extendedSchema().parse(currency).#value;
	}

	public change<N extends CurrencyValue>(currency: N) {
		return new Currency<N>(
			Currency.schema(this.#value).parse(currency) as N,
		);
	}

	public toString() {
		return this.#value;
	}

	public valueOf() {
		return this.#value;
	}
}
