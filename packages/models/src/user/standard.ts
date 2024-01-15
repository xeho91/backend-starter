import { log } from "@packages/logger";

import { User, type UserType } from ".";

export class Standard extends User<"standard"> {
	constructor(data: UserType) {
		super(data);
	}

	public purcharse() {
		log.warn("Incomplete");
	}
}
