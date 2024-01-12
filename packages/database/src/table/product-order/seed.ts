import { Stock } from "@packages/core/stock";
import { log } from "@packages/logger";
import { chunkArray, isChunkedArray } from "@packages/utils/array";
import { getRandomInteger, pickRandomItem } from "@packages/utils/random";
import { eq } from "drizzle-orm/pg-core/expressions";

import { DB } from "../../query.js";
import { Table } from "..";
import { PRODUCT, type Product } from "../product/index.js";
import { TABLE_PRODUCT_ORDER } from ".";

const TABLE_ORDER = Table.get("order");
const TABLE_PRODUCT = Table.get("product");

export async function seedProductsOrders() {
	const [products, orders] = await Promise.all([
		getRandomProductsMap(),
		getOrders(),
	]);

	const data: Array<typeof TABLE_PRODUCT_ORDER.$inferInsert> = orders.flatMap(
		(order) => {
			const generated = new Map(
				Array.from(
					{
						length: getRandomInteger({ min: 1, max: 5 }),
					},
					(_, _index) => {
						const product = pickRandomProduct(products);
						const quantity = getRandomInteger({
							min: 1,
							max: product.stock.valueOf(),
						});

						products.set(product.id.toString(), {
							...product,
							stock: new Stock(
								product.stock.valueOf() - quantity,
							),
						});

						return [
							product.id.toString(),
							{
								order_id: order.id,
								product_id: product.id.toString(),
								quantity,
							},
						];
					},
				),
			);

			return [...generated.values()];
		},
	);

	log.trace(data, "Generated random data of product orders:");
	await DB.insert(TABLE_PRODUCT_ORDER).values(data);

	const updatePromises = chunkArray(
		[...products.values()].map((p) =>
			DB.update(TABLE_PRODUCT)
				.set({ stock: p.stock.valueOf() })
				.where(eq(TABLE_PRODUCT.id, p.id.toString())),
		),
		50,
	);

	if (isChunkedArray(updatePromises)) {
		for (const chunk of updatePromises) {
			await Promise.all(chunk);
		}
	} else {
		await Promise.all(updatePromises);
	}

	log.info("Seeding 'product_order' table finished.");
}

async function getRandomProductsMap() {
	const random = await DB.select().from(TABLE_PRODUCT).limit(85);

	return new Map(random.map((d) => [d.id, PRODUCT.parse(d)]));
}

function pickRandomProduct(map: Map<string, Product>): Product {
	const random = pickRandomItem([...map.values()]);

	return random.stock.valueOf() > 0 ? random : pickRandomProduct(map);
}

async function getOrders() {
	return await DB.select({
		id: TABLE_ORDER.id,
		created_at: TABLE_ORDER.created_at,
		updated_at: TABLE_ORDER.updated_at,
	}).from(TABLE_ORDER);
}
