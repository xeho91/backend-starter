import { getTableConfig, pgTable } from "drizzle-orm/pg-core";
import type { PostgresError } from "postgres";
import { z } from "zod";

import { timestamps } from "./builders.js";
import { TABLE_ORDER } from "./order";
import { TABLE_PRODUCT } from "./product";
import { TABLE_PRODUCT_ORDER } from "./product-order";
import * as relations from "./relations.js";
import { TABLE_USER } from "./user";

export type TableName = (typeof Table.NAMES)[number];

export class Table<
	N extends TableName,
	C extends Parameters<typeof pgTable>[1],
> {
	public static NAMES = [
		"order",
		"product",
		"product_order",
		"user",
	] as const;

	public static NAME_SCHEMA = z.enum(this.NAMES);

	public static validateName(name: unknown) {
		return this.NAME_SCHEMA.parse(name);
	}

	public static isValidName(name: unknown): name is TableName {
		return this.NAME_SCHEMA.safeParse(name).success;
	}

	private static TABLE = {
		order: TABLE_ORDER,
		product: TABLE_PRODUCT,
		product_order: TABLE_PRODUCT_ORDER,
		user: TABLE_USER,
	} as const;

	public static get<N extends TableName>(name: N): (typeof this.TABLE)[N] {
		return this.TABLE[name];
	}

	public static getFromPostgresError(error: PostgresError) {
		return this.get(this.validateName(error.table_name));
	}

	public static RELATIONS = relations;

	#name: TableName;
	#columns: C & ReturnType<typeof timestamps>;

	public constructor(name: N, columns: C) {
		this.#name = Table.NAME_SCHEMA.parse(name);
		this.#columns = {
			...columns,
			...timestamps(),
		};
	}

	get config() {
		return getTableConfig(this.table);
	}

	get table() {
		return pgTable(this.#name, this.#columns);
	}
}
