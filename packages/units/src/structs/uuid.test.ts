import { describe, it } from "vitest";
import { ZodError } from "zod";

import { Uuid } from "./uuid.js";

describe("Uuid", () => {
	describe("new(string)", () => {
		it(`it fails on invalid uuid schema`, ({ expect }) => {
			expect(() => new Uuid(`123aadsd123-31zdds123123-123`)).to.throw(
				ZodError,
			);
		});

		describe(`it succeed on valid schema, and`, () => {
			const uuid = new Uuid(Uuid.generate().toString());

			it("getter 'grouped' returns an array with 5 items", ({
				expect,
			}) => {
				expect(uuid.grouped).toHaveLength(5);
			});

			it("getter 'firstGroup' returns an string with length of 8", ({
				expect,
			}) => {
				expect(uuid.firstGroup).toHaveLength(8);
			});

			it("getter 'leftRandomGroup' returns an string with length of 4", ({
				expect,
			}) => {
				expect(uuid.leftRandomGroup).toHaveLength(4);
			});

			it("getter 'versionGroup' returns an string with length of 4 and starts with 4", ({
				expect,
			}) => {
				expect(uuid.versionGroup).toHaveLength(4);
				expect(uuid.versionGroup.startsWith("4")).toBe(true);
			});

			it("getter 'rightRandomGroup' returns an string with length of 4", ({
				expect,
			}) => {
				expect(uuid.rightRandomGroup).toHaveLength(4);
			});

			it("getter 'lastGroup' returns an string with length of 12", ({
				expect,
			}) => {
				expect(uuid.lasttGroup).toHaveLength(12);
			});
		});
	});

	describe("isEqualTo(Uuid)", () => {
		it("returns false when compared with another uuid", ({ expect }) => {
			const uuid = new Uuid(Uuid.generate().toString());
			const anotherUuid = new Uuid(Uuid.generate().toString());

			expect(uuid.isEqualTo(anotherUuid)).toBe(false);
		});

		it("returns true when compared with same uuid", ({ expect }) => {
			const uuid = new Uuid(Uuid.generate().toString());

			expect(uuid.isEqualTo(uuid)).toBe(true);
		});
	});
});
