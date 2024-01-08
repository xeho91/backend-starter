/// <reference types="vitest" />

import { WITH_COVERAGE_OPTIONS } from "@terminal-nerds/vitest-config";
import { configDefaults, defineWorkspace } from "vitest/config";

/** @see {@link https://vitest.dev/guide/workspace} */
export default defineWorkspace([
	"./apps/*",
	{
		test: {
			...WITH_COVERAGE_OPTIONS,
			environment: "node",
			exclude: [
				//
				...configDefaults.exclude,
				"**/dist/*",
			],
		},
	},

	"./packages/*",
	{
		test: {
			...WITH_COVERAGE_OPTIONS,
			environment: "node",
			exclude: [
				//
				...configDefaults.exclude,
				"**/lib/*",
			],
		},
	},
]);
