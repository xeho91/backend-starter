import { excludeFromArray } from "@packages/utils/array";
import { describe, it } from "vitest";
import { ZodError } from "zod";

import { UserRole, type UserRoleType } from "./user-role.js";

describe("UserRole", () => {
	describe("is(role)", () => {
		it("throws error when provided role is not included in the enum", ({
			expect,
		}) => {
			const status = new UserRole("standard");
			// @ts-expect-error - Testing
			expect(() => status.is("super-admin")).toThrowError(ZodError);
		});
	});

	describe("success when provided role is included in the enum and:", () => {
		const current = "standard" satisfies UserRoleType;
		const instance = new UserRole(current);

		it("returns false when is not the same", ({ expect }) => {
			for (const role of excludeFromArray(UserRole.ENUM, [current])) {
				expect(instance.is(role)).toBe(false);
			}
		});

		it("returns true when is same", ({ expect }) => {
			expect(instance.is(current)).toBe(true);
		});
	});

	describe("update(role)", () => {
		it("throws error when provided role is same as the current one", ({
			expect,
		}) => {
			const role = new UserRole("standard");
			// @ts-expect-error Testing
			expect(() => role.assign("pending")).toThrowError(ZodError);
		});

		it("success when provided role is NOT same as the current one", ({
			expect,
		}) => {
			const current = "standard" satisfies UserRoleType;
			const instance = new UserRole(current);

			for (const role of excludeFromArray(UserRole.ENUM, [current])) {
				expect(() => instance.assign(role)).not.toThrowError(ZodError);
			}
		});
	});
});
