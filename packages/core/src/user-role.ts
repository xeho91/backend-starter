import { z } from "zod";

export class UserRole<R extends UserRoleType = UserRoleType> {
	/** Available user roles in the project. */
	public static ENUM = ["standard", "manager", "admin"] as const;

	public static SCHEMA = z.enum(this.ENUM);

	public static isValid(value: unknown): value is UserRoleType {
		return this.SCHEMA.safeParse(value).success;
	}

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	protected value: UserRoleType;

	constructor(value: R) {
		this.value = UserRole.SCHEMA.parse(value);
	}

	public isAdmin(): this is Extract<UserRoleType, "admin"> {
		return this.value === "admin";
	}

	public isManager(): this is Extract<UserRoleType, "manager"> {
		return this.value === "manager";
	}

	public isStandard(): this is Extract<UserRoleType, "standard"> {
		return this.value === "standard";
	}

	public update<N extends Exclude<UserRoleType, R>>(value: N): UserRole<N> {
		return new UserRole(value);
	}

	public toString() {
		return this.value as R;
	}

	public valueOf() {
		return this.value;
	}
}

export type UserRoleType = (typeof UserRole)["ENUM"][number];
