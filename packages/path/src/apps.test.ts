import { describe, it } from "vitest";

import { getAppRootPath, WORKSPACE_APPS } from "./apps.js";

describe("getAppRootPath(name)", () => {
	for (const name of WORKSPACE_APPS) {
		it(`successfully finds the absolute root path for app ("${name}")`, async ({
			expect,
		}) => {
			const path = await getAppRootPath(name);

			expect(path.startsWith(process.env["HOME"] as string)).toBe(true);
			expect(path.endsWith(`apps/${name}`)).toBe(true);
		});
	}
});
