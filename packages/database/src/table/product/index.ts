import { Uuid } from "@packages/core/id";
import { Name } from "@packages/core/name";
import { Price } from "@packages/core/price";
import { Stock } from "@packages/core/stock";
import { Timestamp } from "@packages/core/timestamp";
import { boolean, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { price, timestamps } from "../builders.js";

export const TABLE_PRODUCT = pgTable("product", {
	// TODO: Figure out if using `serial` would be more sufficient for this case
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: Name.LENGTH_MAX }).notNull(),
	stock: integer("stock").notNull(),
	price: price().notNull(),
	/** NOTE: If someone has ordered the product, it will be locked. */
	locked: boolean("locked").notNull().default(false),
	...timestamps(),
});

/** Schema for products **insertion** to table in the database. */
export const INSERT_PRODUCT = createInsertSchema(TABLE_PRODUCT, {
	name: Name.createSchema(),
	stock: Stock.createSchema(),
	price: Price.createSchema(),
})
	.pick({
		name: true,
		stock: true,
		price: true,
	})
	.strict();

/** @see {@link PRODUCT} */
export type Product = z.infer<typeof PRODUCT>;
/** Schema for products **selection** from table in the database. */
export const PRODUCT = createSelectSchema(TABLE_PRODUCT, {
	id: Uuid.createSchema(),
	name: Name.createSchema(),
	stock: Stock.createSchema(),
	price: Price.createSchema(),
	created_at: Timestamp.createSchema(),
	updated_at: Timestamp.createSchema(),
}).strict();
