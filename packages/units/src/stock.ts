import type { Integer } from "type-fest";
import { z } from "zod";

import type { Struct } from "./types.d.ts";

export class Stock implements Struct<number> {
	/**
	 * NOTE:
	 * Stock's min is `0`,
	 * but we can't set it as `const`.
	 */
	public static MIN = 0;
	public static MAX = 1_000_000_000 as const;

	public static schema() {
		return z.number().int().min(this.MIN).max(this.MAX);
	}

	public static isValid<N extends number>(value: N): value is Integer<N> {
		return this.schema().safeParse(value).success;
	}

	public static createSchema() {
		return this.schema()
			.transform((v) => new this(v))
			.or(z.instanceof(this));
	}

	#value: number;

	constructor(value: number) {
		this.#value = Stock.schema().parse(value);
	}

	/**
	 * Thankts to the inner schema, it will handle whether the value did not go below stock's **min** value.
	 * @param quantity - count _(integer)_ to take/deduct from the stock's value
	 */
	public take(quantity: Quantity) {
		this.#value = Stock.schema().parse(this.#value - quantity.valueOf());
	}

	/**
	 * Thankts to the inner schema, it will handle whether the value did not go below stock's **max** value.
	 * @param quantity - count _(integer)_ to return/add from the stock's value
	 */
	public return(quantity: number) {
		return new Stock(this.#value + quantity.valueOf());
	}

	public toString() {
		return this.#value.toString();
	}

	public valueOf() {
		return this.#value;
	}
}

export class Quantity extends Stock {
	public static override MIN = 1 as const;

	constructor(value: number) {
		super(Quantity.schema().parse(value));
	}
}
