import { faker } from "@faker-js/faker";
import { log } from "@packages/logger";
import { getRandomInteger } from "@packages/utils/random";
import { eq } from "drizzle-orm";

import { DB } from "../../query.js";
import { Table } from "..";
import { TABLE_ORDER } from ".";

export async function seedOrders() {
	const user = Table.get("user");
	const customers = await DB.select({ id: user.id })
		.from(user)
		.where(eq(user.role, "standard"));
	const data: Array<typeof TABLE_ORDER.$inferInsert> = [];

	for (const customer of customers) {
		const customer_id = customer.id;
		const orders: Array<typeof TABLE_ORDER.$inferInsert> = Array.from(
			{ length: getRandomInteger({ min: 5, max: 10 }) },
			(_value, _index) => {
				return {
					customer_id,
					created_at: faker.date.recent(),
					updated_at: faker.date.future(),
				};
			},
		);

		data.push(...orders);
	}

	log.trace(data, "Generated random data of orders:");
	await DB.insert(TABLE_ORDER).values(data);
	log.info(`Seeding 'order' table finished.`);
}
