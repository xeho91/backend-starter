import { log } from "@packages/logger";

import { User, type UserType } from ".";

export class Manager extends User<"manager"> {
	constructor(data: UserType) {
		super(data);
	}

	public delegateTask() {
		log.silent("Just... enjoy... the... silence...");
	}
}
