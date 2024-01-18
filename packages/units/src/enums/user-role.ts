import { z } from "zod";

import type { Enum } from "../types.d.ts";

export type UserRoleValue = (typeof UserRole)["ENUM"][number];
export type UserRoleType = UserRoleValue | UserRole;

export class UserRole<T extends UserRoleValue = typeof UserRole.DEFAULT>
	implements Enum<UserRoleValue>
{
	/** Default value for this enum. */
	public static DEFAULT = "standard" as const satisfies UserRoleValue;

	/** Available user roles in the project. */
	public static ENUM = ["standard", "manager", "admin"] as const;

	/** Zod default _(without transformation)_ schema, to parse **without** instance. */
	public static schema() {
		return z.enum(this.ENUM);
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(value: unknown): value is UserRoleValue {
		return this.schema().safeParse(value).success;
	}

	/** Zod extended _(with transformation)_ schema, to parse **with** instance. */
	public static extendedSchema() {
		return this.schema()
			.transform((v) => new this(v))
			.or(z.instanceof(this));
	}

	#value: UserRoleValue;

	constructor(value: T = UserRole.DEFAULT as T) {
		this.#value = UserRole.schema().parse(value) as T;
	}

	public is<R extends UserRoleValue>(
		role: R | UserRole<R>,
	): this is UserRole<R> {
		return this.#value === UserRole.extendedSchema().parse(role).#value;
	}

	public assign<N extends Exclude<UserRoleValue, T>>(role: N) {
		return new UserRole<N>(
			UserRole.schema().exclude([this.#value]).parse(role),
		);
	}

	public toString() {
		return this.#value;
	}

	public valueOf() {
		return this.#value;
	}
}
