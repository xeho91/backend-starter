import { describe, it } from "vitest";

import { findAppRootPath, WORKSPACE_APPS } from "./apps.js";

describe("findAppRootPath(name)", () => {
	for (const name of WORKSPACE_APPS) {
		it(`successfully finds the absolute root path for app ("${name}")`, async ({
			expect,
		}) => {
			const path = await findAppRootPath(name);

			expect(path.startsWith(process.env["HOME"] as string)).toBe(true);
			expect(path.endsWith(`apps/${name}`)).toBe(true);
		});
	}
});
