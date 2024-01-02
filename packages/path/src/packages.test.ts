import { describe, it } from "vitest";

import { getPackageRootPath, WORKSPACE_PACKAGES } from "./packages.js";

describe("getPackageRootPath(name)", () => {
	for (const name of WORKSPACE_PACKAGES) {
		it(`successfully finds the absolute root path for the package ("${name}")`, async ({
			expect,
		}) => {
			const path = await getPackageRootPath(name);

			expect(path.startsWith(process.env["HOME"] as string)).toBe(true);
			expect(path.endsWith(`packages/${name}`)).toBe(true);
		});
	}
});
