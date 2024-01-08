import { Price } from "@packages/core/price";
import { numeric } from "drizzle-orm/pg-core/columns/numeric";
import { timestamp } from "drizzle-orm/pg-core/columns/timestamp";

/**
 * This snippets helps to ensure every table in this project uses the same **timestamps**.
 */
export function timestamps() {
	return {
		created_at: timestamp("created_at").notNull().defaultNow(),
		// TODO: Implement auto-update, when available
		// Reference: https://github.com/drizzle-team/drizzle-orm/issues/956#issuecomment-1732327425
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	} as const;
}

/**
 * This snipepts helps to ensure every table in this project uses the same **price** builder.
 */
export function price() {
	return numeric("price", {
		precision: Price.PRECISION,
		scale: Price.SCALE,
	});
}
