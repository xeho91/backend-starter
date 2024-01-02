import path from "node:path";

import { log } from "@packages/logger";

import { findWorkspaceRootPath } from "./main.js";

/**
 * Currently available project's workspace **library** packages.
 */
export const WORKSPACE_PACKAGES = [
	"config",
	"core",
	"database",
	"logger",
	"path",
	"utils",
] as const;

/** @see {@link WORKSPACE_PACKAGES} */
export type WorkspacePackage = (typeof WORKSPACE_PACKAGES)[number];

/**
 * Get the **absolute path** to the project's workspace targetted _package_ root directory.
 * @param name - workspace package to target
 */
export async function getPackageRootPath<T extends WorkspacePackage>(name: T) {
	const directory = "packages";
	const result = path.join(
		await findWorkspaceRootPath(),
		directory,
		name,
	) as `/${string}/${typeof directory}/${T}`;

	log.debug(
		`Determined the absolute path of the LIBRARY package "@${directory}/${name}": file://${result}`,
	);

	return result;
}
