/* eslint-disable n/no-process-exit, unicorn/no-process-exit */

import { log } from "@packages/logger";

import { seedOrders } from "../src/table/order/seed.js";
import { seedProducts } from "../src/table/product/seed.js";
import { seedProductsOrders } from "../src/table/product-order/seed.js";
import { seedUsers } from "../src/table/user/seed.js";

async function seed() {
	await Promise.all([seedUsers(), seedProducts()]);
	await seedOrders();
	await seedProductsOrders();
}

try {
	log.info("Seeding the database...");
	await seed();
	log.info("Done!");
	process.exit(0);
} catch (error) {
	log.fatal({ error }, "An error occured!");
	throw error;
}
