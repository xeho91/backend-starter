import { excludeFromArray } from "@packages/utils/array";
import { describe, it } from "vitest";
import { ZodError } from "zod";

import { OrderStatus, type OrderStatusType } from "./order-status.js";

describe("OrderStatus", () => {
	describe("is(status)", () => {
		it("throws error when provided status is not included in the enum", ({
			expect,
		}) => {
			const status = new OrderStatus("pending");
			// @ts-expect-error - Testing
			expect(() => status.is("finished")).toThrowError(ZodError);
		});
	});

	describe("success when provided status is included in the enum and:", () => {
		const current = "pending" satisfies OrderStatusType;
		const instance = new OrderStatus(current);

		it("returns false when is not the same", ({ expect }) => {
			for (const status of excludeFromArray(OrderStatus.ENUM, [
				current,
			])) {
				expect(instance.is(status)).toBe(false);
			}
		});

		it("returns true when is same", ({ expect }) => {
			expect(instance.is(current)).toBe(true);
		});
	});

	describe("update(status)", () => {
		it("throws error when provided status is same as the current one", ({
			expect,
		}) => {
			const status = new OrderStatus("pending");
			// @ts-expect-error Testing
			expect(() => status.update("pending")).toThrowError(ZodError);
		});

		it("success when provided status is NOT same as the current one", ({
			expect,
		}) => {
			const current = "pending" satisfies OrderStatusType;
			const instance = new OrderStatus(current);

			for (const status of excludeFromArray(OrderStatus.ENUM, [
				current,
			])) {
				expect(() => instance.update(status)).not.toThrowError(
					ZodError,
				);
			}
		});
	});
});
