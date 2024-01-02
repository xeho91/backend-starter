import { join } from "node:path";

import { log } from "@packages/logger";
import { findWorkspaceRootPath } from "@packages/path";
import dotenv from "dotenv";

export async function getDotenvFilePath() {
	return join(await findWorkspaceRootPath(), ".env");
}

export async function loadDotenv() {
	const path = await getDotenvFilePath();
	log.trace(`Reading sensitive variables from the dotenv: file://${path}`);

	const { error, parsed } = dotenv.config({
		debug: process.env["DEBUG"] !== undefined,
		path,
	});

	if (parsed) {
		log.debug({ env: parsed }, `Dotenv content:`);
		return parsed;
	}

	if (error) {
		log.fatal({ error }, `DotenvError`);
		throw error;
	} else {
		throw new Error("Nothing has returned from parsing the dotenv file.");
	}
}
