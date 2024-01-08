import { Email } from "@packages/core/email";
import { Uuid } from "@packages/core/id";
import { EncryptedPassword } from "@packages/core/password";
import { Timestamp } from "@packages/core/timestamp";
import { UserRole } from "@packages/core/user-role";
import { uuid } from "drizzle-orm/pg-core/columns/uuid";
import { varchar } from "drizzle-orm/pg-core/columns/varchar";
import { pgTable } from "drizzle-orm/pg-core/table";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "../builders.js";
import { ENUM_USER_ROLE } from "../enums.js";

export const TABLE_USER = pgTable("user", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email", { length: Email.MAX }).notNull().unique(),
	password: varchar("password", {
		length: EncryptedPassword.LENGTH,
	}).notNull(),
	role: ENUM_USER_ROLE("user_role").default("standard").notNull(),
	...timestamps(),
});

/** Schema for users **insertion** to table in the database. */
export const INSERT_USER = createInsertSchema(TABLE_USER, {
	email: Email.createSchema(),
	password: EncryptedPassword.createSchema(),
	role: UserRole.createSchema(),
})
	.omit({
		id: true,
		created_at: true,
		updated_at: true,
	})
	.strict();

/** @see {@link USER} */
export type User = z.infer<typeof USER>;
/** Schema for users **selection** from table in the database. */
export const USER = createSelectSchema(TABLE_USER, {
	id: Uuid.createSchema(),
	email: Email.createSchema(),
	password: EncryptedPassword.createSchema(),
	role: UserRole.createSchema(),
	created_at: Timestamp.createSchema(),
	updated_at: Timestamp.createSchema(),
}).strict();

/** @see {@link USER_PUBLIC} */
export type UserPublic = z.infer<typeof USER_PUBLIC>;
/** Schema for users **public** data _(it's credentials are excluded)_. */
export const USER_PUBLIC = USER.omit({
	email: true,
	password: true,
}).strict();

/** @see {@link USER_CREDENTIALS} */
export type UserCredentials = z.infer<typeof USER_CREDENTIALS>;
/** Schema for users **private** data _(they're sensitive - should be protected)_. */
export const USER_CREDENTIALS = USER.pick({
	email: true,
	password: true,
}).strict();
