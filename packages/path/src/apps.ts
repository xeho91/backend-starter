import path from "node:path";

import { log } from "@packages/logger";

import { findWorkspaceRootPath } from "./main.js";

/**
 * Currently available project workspace's **binary** packages _(apps)_.
 */
export const WORKSPACE_APPS = [
	/* prettier-ignore */
	"api",
] as const;

/** @see {@link WORKSPACE_APPS} */
export type WorkspaceApp = (typeof WORKSPACE_APPS)[number];

/**
 * Get the **absolute path** to the project workspace targetted _app_ root directory.
 * @param name - workspace app to target
 */
export async function findAppRootPath<T extends WorkspaceApp>(name: T) {
	const directory = "apps";
	const result = path.join(
		await findWorkspaceRootPath(),
		directory,
		name,
	) as `/${string}/${typeof directory}/${T}`;

	log.debug(
		`Determined the absolute path of the BINARY package "@${directory}/${name}": file://${result}`,
	);

	return result;
}
