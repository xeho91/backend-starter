import { z } from "zod";

import type { Enum } from "../types.d.ts";

export class OrderStatus<
	T extends OrderStatusType = (typeof OrderStatus)["DEFAULT"],
> implements Enum<OrderStatusType>
{
	/** Default value for this enum. */
	public static DEFAULT = "pending" as const satisfies OrderStatusType;

	/** Possible order statuses in the project. */
	public static ENUM = ["pending", "locked", "completed"] as const;

	/** Zod default _(without transformation)_ schema, to parse **without** instance. */
	public static schema() {
		return z.enum(this.ENUM);
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(value: unknown): value is OrderStatusType {
		return this.schema().safeParse(value).success;
	}

	/** Zod extended _(with transformation)_ schema, to parse **with** instance. */
	public static extendedSchema() {
		return this.schema()
			.transform((v) => new this(v))
			.or(z.instanceof(this));
	}

	#value: OrderStatusType;

	constructor(value: T = OrderStatus.DEFAULT as T) {
		this.#value = OrderStatus.schema().parse(value) as T;
	}

	public is<S extends OrderStatusType>(
		status: S | OrderStatus<S>,
	): status is OrderStatus<S> {
		return (
			this.#value === OrderStatus.extendedSchema().parse(status).#value
		);
	}

	public update<N extends Exclude<OrderStatusType, T>>(status: N) {
		return new OrderStatus<N>(
			OrderStatus.schema().exclude([this.#value]).parse(status),
		);
	}

	public toString() {
		return this.#value;
	}

	public valueOf() {
		return this.#value;
	}
}

export type OrderStatusType = (typeof OrderStatus)["ENUM"][number];
