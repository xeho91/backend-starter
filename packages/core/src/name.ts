import { z } from "zod";

export class Name {
	public static LENGTH_MIN = 1;
	public static LENGTH_MAX = 255;

	public static SCHEMA = z.string().min(this.LENGTH_MIN).max(this.LENGTH_MAX);

	public static isValid(value: string): value is string {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	protected value: string;

	constructor(value: string) {
		this.value = Name.SCHEMA.parse(value);
	}

	public toString() {
		return this.value;
	}

	public valueOf() {
		return this.value;
	}
}
