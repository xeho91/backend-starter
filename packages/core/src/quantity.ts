import { Stock } from "./stock.js";

export class Quantity extends Stock {
	public static override MIN = 1;

	constructor(value: number) {
		super(Quantity.SCHEMA.parse(value));
	}
}
