import { UserRole, type UserRoleType } from "@packages/core/enums/user-role";
import { Uuid } from "@packages/core/structs/uuid";
import { Timestamp } from "@packages/core/timestamp";
import { z } from "zod";

import type { Serializeable } from "../types.d.ts";

export type UserType = z.infer<ReturnType<(typeof User)["schema"]>>;

export class User<R extends UserRoleType> implements Serializeable<UserType> {
	static schema() {
		return z
			.object({
				id: Uuid.extendedSchema(),
				role: UserRole.extendedSchema(),
				created_at: Timestamp.createSchema(),
				updated_at: Timestamp.createSchema(),
			})
			.strict();
	}

	static isValid(data: unknown): data is UserType {
		return this.schema().safeParse(data).success;
	}

	public id: Uuid;
	public role: UserRole<R>;
	public created_at: Timestamp;
	public updated_at: Timestamp;

	constructor(data: UserType) {
		const { id, role, created_at, updated_at } = User.schema().parse(data);

		this.id = id;
		this.role = role;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	public isAdmin(): this is User<"admin"> {
		return this.role.is("admin");
	}

	public isManager(): this is User<"manager"> {
		return this.role.is("manager");
	}

	public isStandard(): this is User<"standard"> {
		return this.role.is("standard");
	}

	public serialize() {
		return {
			id: this.id.valueOf(),
			role: this.role.valueOf(),
			created_at: this.created_at.valueOf(),
			updated_at: this.updated_at.valueOf(),
		};
	}
}
