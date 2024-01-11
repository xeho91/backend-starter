import { z } from "zod";

export class Currency {
	public static DEFAULT: CurrencyType = "TWD";
	/** Available currencies in the project. */
	public static ENUM = ["AUD", "EUR", "PLN", "TWD", "USD", "NZD"] as const;

	public static SCHEMA = z.enum(this.ENUM);

	public static isValid(value: unknown): value is CurrencyType {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	protected value: CurrencyType;

	constructor(value: CurrencyType) {
		this.value = Currency.SCHEMA.parse(value);
	}

	public toString() {
		return this.value;
	}

	public valueOf() {
		return this.value;
	}
}

export type CurrencyType = (typeof Currency)["ENUM"][number];
