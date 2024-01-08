import { Uuid } from "@packages/core/id";
import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { TABLE_ORDER } from "../order";
import { TABLE_PRODUCT } from "../product";

export const TABLE_PRODUCT_ORDER = pgTable(
	"product_order",
	{
		product_id: uuid("product_id")
			.notNull()
			.references(() => TABLE_PRODUCT.id),
		order_id: uuid("order_id")
			.notNull()
			.references(() => TABLE_ORDER.id),
		// TODO: Implement "CHECK" (min: 1) - tracker: https://orm.drizzle.team/docs/indexes-constraints#check
		quantity: integer("quantity").notNull(),
		// TODO: Add this feature
		// price_at_order: price().notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.product_id, table.order_id] }),
		};
	},
);

/** Schema for products orders **insertion** to table in the database. */
export const INSERT_PRODUCT_ORDER = createInsertSchema(TABLE_PRODUCT_ORDER, {
	order_id: Uuid.createSchema(),
	product_id: Uuid.createSchema(),
});

/** @see {@link PRODUCT_ORDER} */
export type ProductOrder = z.infer<typeof PRODUCT_ORDER>;
/** Schema for products orders **selection** from table in the database. */
export const PRODUCT_ORDER = createSelectSchema(TABLE_PRODUCT_ORDER, {});
