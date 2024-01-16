import { Password } from "packages/units/lib/password.js";
import {
	Email,
	type StringifiedEmail,
} from "packages/units/lib/structs/email.js";
import { EncryptedPassword } from "packages/units/src/encrypted-password.js";
import { z } from "zod";

import type { Serializeable } from "../types.d.ts";

export type UserCredentialsType = z.infer<
	ReturnType<(typeof UserCredentials)["extendedSchema"]>
>;

export class UserCredentials implements Serializeable<UserCredentialsType> {
	static schema() {
		return z
			.object({
				email: Email.extendedSchema(),
				password: EncryptedPassword.extendedSchema(),
			})
			.strict();
	}

	static isValid(data: unknown): data is UserCredentialsType {
		return this.schema().safeParse(data).success;
	}

	#email: Email;
	#password: EncryptedPassword;

	constructor(data: UserCredentialsType) {
		const { email, password } = UserCredentials.schema().parse(data);

		this.#email = email;
		this.#password = password;
	}

	public set email(newEmail: Email | StringifiedEmail) {
		this.#email = Email.extendedSchema().parse(newEmail);
	}

	public async updatePassword(newPassword: Password) {
		this.#password = await EncryptedPassword.from(newPassword);
	}

	public serialize() {
		return {
			email: this.#email.valueOf(),
			password: this.#password.valueOf(),
		};
	}
}

const x = new UserCredentials({
	email: "lol",
	password: "lol",
});
