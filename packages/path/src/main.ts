import path from "node:path";

import { log } from "@packages/logger";
import { findUp, pathExists } from "find-up";

/**
 * A file which will determine that the directory is a workspace root.
 */
const FILENAME_TO_FIND = "pnpm-workspace.yaml";

/**
 * Find the workspace root based on the existence
 * of a file specified in `FILE_TO_FIND`.
 * @throws When the directory cannot be determined.
 */
export async function findWorkspaceRootPath(): Promise<string> {
	log.trace(
		`Attempting to determine the workspace root path based on the filename: "${FILENAME_TO_FIND}" ...`,
	);

	const directoryPath = await findUp(determinePath, { type: "directory" });

	if (directoryPath) {
		return directoryPath;
	} else {
		throw new Error(
			`Couldn't determine the workspace ROOT absolute path based on the filename to find: "${FILENAME_TO_FIND}"!`,
		);
	}
}

/**
 * A callback to run in `findUp()`
 * @param directory - Directory path which is being determined
 */
async function determinePath(directory: string): ReturnType<typeof findUp> {
	const pathAttempt = path.join(directory, FILENAME_TO_FIND);
	const pathHasFile = await pathExists(pathAttempt);

	if (pathHasFile) {
		log.debug(
			`Determined the absolute path of the project workspace ROOT: file://${directory}`,
		);
		return directory;
	} else {
		log.trace(
			`This absolute path is NOT the workspace ROOT: file://${directory}`,
		);
	}
}
