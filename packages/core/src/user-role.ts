import { pgEnum } from "drizzle-orm/pg-core/columns/enum";
import { z } from "zod";

export class UserRole {
	/** Available user roles in the project. */
	public static ENUM = ["standard", "manager", "admin"] as const;

	public static SCHEMA = z.enum(this.ENUM);

	private static PG_ENUM_NAME = "user_role";
	/** PostgresSQL enum. */
	public static PG_ENUM = pgEnum(
		this.PG_ENUM_NAME,
		this.ENUM,
	)(this.PG_ENUM_NAME);

	public static createSchema() {
		return this.SCHEMA.transform((v) => new this(v)).or(z.instanceof(this));
	}

	public value: UserRoleType;

	constructor(value: UserRoleType) {
		this.value = UserRole.SCHEMA.parse(value);
	}
}

export type UserRoleType = (typeof UserRole)["ENUM"][number];
