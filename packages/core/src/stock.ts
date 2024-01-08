import type { Integer } from "type-fest";
import { z } from "zod";

export class Stock {
	public static MIN = 0;
	public static MAX = 1_000_000_000;

	public static SCHEMA = z.number().int().min(this.MIN).max(this.MAX);

	public static isValid<N extends number>(value: N): value is Integer<N> {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	protected value: number;

	constructor(value: number) {
		this.value = Stock.SCHEMA.parse(value);
	}

	public toString() {
		return this.value.toString();
	}

	public valueOf() {
		return this.value;
	}
}
