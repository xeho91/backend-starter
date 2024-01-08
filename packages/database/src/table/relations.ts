import { relations } from "drizzle-orm";

import { TABLE_ORDER } from "./order";
import { TABLE_PRODUCT } from "./product";
import { TABLE_PRODUCT_ORDER } from "./product-order";
import { TABLE_USER } from "./user";

export const RELATIONS_TABLE_ORDER = relations(
	TABLE_ORDER,
	({ many, one }) => ({
		customer: one(TABLE_USER, {
			fields: [TABLE_ORDER.customer_id],
			references: [TABLE_USER.id],
		}),
		product_orders: many(TABLE_PRODUCT_ORDER),
	}),
);

export const RELATIONS_TABLE_USER = relations(TABLE_USER, ({ many }) => ({
	orders: many(TABLE_ORDER),
}));

export const RELATIONS_TABLE_PRODUCT = relations(TABLE_PRODUCT, ({ one }) => ({
	orders: one(TABLE_PRODUCT_ORDER, {
		fields: [TABLE_PRODUCT.id],
		references: [TABLE_PRODUCT_ORDER.product_id],
	}),
}));

export const RELATIONS_TABLE_PRODUCT_ORDER = relations(
	TABLE_PRODUCT_ORDER,
	({ one }) => ({
		order: one(TABLE_ORDER, {
			fields: [TABLE_PRODUCT_ORDER.order_id],
			references: [TABLE_ORDER.id],
		}),
	}),
);
