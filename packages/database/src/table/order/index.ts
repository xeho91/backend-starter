import { Uuid } from "@packages/core/id";
import { OrderStatus } from "@packages/core/order-status";
import { Timestamp } from "@packages/core/timestamp";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "../builders.js";
import { ENUM_ORDER_STATUS } from "../enums.js";
import { TABLE_USER } from "../user";

export const TABLE_ORDER = pgTable("order", {
	id: uuid("id").defaultRandom().primaryKey(),
	status: ENUM_ORDER_STATUS("status").notNull().default("pending"),
	customer_id: uuid("customer_id")
		.notNull()
		.references(() => TABLE_USER.id),
	...timestamps(),
});

export const INSERT_ORDER = createInsertSchema(TABLE_ORDER, {
	customer_id: Uuid.createSchema(),
})
	.pick({
		customer_id: true,
	})
	.strict();

/** @see {@link ORDER} */
export type Order = z.infer<typeof ORDER>;
/** Schema for orders **selection** from table in the database. */
export const ORDER = createSelectSchema(TABLE_ORDER, {
	id: Uuid.createSchema(),
	status: OrderStatus.createSchema(),
	customer_id: Uuid.createSchema(),
	created_at: Timestamp.createSchema(),
	updated_at: Timestamp.createSchema(),
}).strict();
