import { faker } from "@faker-js/faker";
import { UserRole } from "@packages/core/user-role";
import { log } from "@packages/logger";
import { pickRandomItem } from "@packages/utils/random";

import { DB } from "../../query.js";
import { TABLE_USER } from ".";

export async function seedUsers() {
	const data: Array<typeof TABLE_USER.$inferInsert> = Array.from(
		{
			length: 100,
		},
		(_, _index) => {
			return {
				email: faker.internet.email(),
				password: faker.internet.password(),
				role: pickRandomItem(UserRole.ENUM),
				created_at: faker.date.recent(),
				updated_at: faker.date.future(),
			};
		},
	);

	log.trace(data, "Generated random data of users:");
	await DB.insert(TABLE_USER).values(data);
	log.info("Seeding 'user' table finished.");
}
