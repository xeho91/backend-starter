import { log } from "@packages/logger";

import { User, type UserType } from ".";

export class Admin extends User<"admin"> {
	constructor(data: UserType) {
		super(data);
	}

	public banHammer() {
		log.fatal("Oh no, who's the poor soul?");
	}
}
