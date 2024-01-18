import { describe, it } from "vitest";
import { ZodError } from "zod";

import { Email } from "./email.js";

describe("Email", () => {
	describe("new(string)", async () => {
		it(`it fails on invalid email schema`, ({ expect }) => {
			expect(() => new Email(`invalid_at_email`)).to.throw(ZodError);
		});

		describe(`it succeed and:`, () => {
			const email = new Email("test@email.com");

			it(`has field "localPart"`, ({ expect }) => {
				expect(email.localPart).toBe("test");
			});

			it(`has field "domain"`, ({ expect }) => {
				expect(email.domain).toBe("email.com");
			});
		});
	});
});
