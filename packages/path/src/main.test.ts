import { describe, it } from "vitest";

import { findWorkspaceRootPath } from "./main.js";

describe("findWorkspaceRootPath()", () => {
	it("successfully found the workspace absolute root path", async ({
		expect,
	}) => {
		const path = await findWorkspaceRootPath();

		expect(path.startsWith(process.env["HOME"] as string)).toBe(true);
		expect(path.endsWith("/backend-starter")).toBe(true);
	});
});
