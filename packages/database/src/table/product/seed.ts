import { faker } from "@faker-js/faker";
import { Price } from "@packages/core/price";
import { Stock } from "@packages/core/stock";
import { log } from "@packages/logger";
import { getRandomBoolean, getRandomInteger } from "@packages/utils/random";

import { DB } from "../../query.js";
import { TABLE_PRODUCT } from ".";

export async function seedProducts() {
	const data: Array<typeof TABLE_PRODUCT.$inferInsert> = Array.from(
		{
			length: 100,
		},
		(_, _index) => {
			return {
				name: faker.commerce.productName(),
				stock: getRandomInteger({ min: Stock.MIN, max: Stock.MAX }),
				price: faker.commerce.price({ min: Price.MIN, max: Price.MAX }),
				locked: getRandomBoolean(),
				created_at: faker.date.recent(),
				updated_at: faker.date.future(),
			};
		},
	);

	log.trace(data, "Generated random data of products:");
	await DB.insert(TABLE_PRODUCT).values(data);
	log.info("Seeding 'product' table finished.");
}
