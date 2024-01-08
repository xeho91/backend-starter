import { log } from "@packages/logger";
import { drizzle } from "drizzle-orm/postgres-js";

import { Table } from "./table/index.js";

/** Get **shared** Drizzle ORM options. */
export function getDrizzleOptions() {
	return {
		logger: {
			logQuery(query, params) {
				log.info({ params, query }, "Drizzle ORM:");
			},
		},
		schema: {
			...Table.RELATIONS,
			products: Table.get("product"),
			users: Table.get("user"),
		},
	} as const satisfies Parameters<typeof drizzle>[1];
}
