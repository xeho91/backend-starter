import { z } from "zod";

import type { Enum } from "../types.d.ts";

export class UserRole<T extends UserRoleType = typeof UserRole.DEFAULT>
	implements Enum<UserRoleType>
{
	/** Default value for this enum. */
	public static DEFAULT = "standard" as const satisfies UserRoleType;

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
	public static isValid(value: unknown): value is UserRoleType {
		return this.schema().safeParse(value).success;
	}

	/** Zod extended _(with transformation)_ schema, to parse **with** instance. */
	public static extendedSchema() {
		return this.schema()
			.transform((v) => new this(v))
			.or(z.instanceof(this));
	}

	#value: UserRoleType;

	constructor(value: T = UserRole.DEFAULT as T) {
		this.#value = UserRole.schema().parse(value) as T;
	}

	public is<R extends UserRoleType>(
		role: R | UserRole<R>,
	): this is UserRole<R> {
		return this.#value === UserRole.extendedSchema().parse(role).#value;
	}

	public assign<N extends Exclude<UserRoleType, T>>(role: N) {
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

export type UserRoleType = (typeof UserRole)["ENUM"][number];
