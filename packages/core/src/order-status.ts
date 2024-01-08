import { z } from "zod";

export class OrderStatus {
	/** Possible order statuses in the project. */
	public static ENUM = ["pending", "locked", "completed"] as const;

	public static SCHEMA = z.enum(this.ENUM);

	public static isValid(value: unknown): value is OrderStatusType {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	protected value: OrderStatusType;

	constructor(value: OrderStatusType) {
		this.value = OrderStatus.SCHEMA.parse(value);
	}

	public toString() {
		return this.value;
	}

	public valueOf() {
		return this.value;
	}
}

export type OrderStatusType = (typeof OrderStatus)["ENUM"][number];
