/// <reference types="vitest" />

import { defineProject } from "vitest/config";

export default defineProject({
	test: {
		setupFiles: ["./test/database.ts"],
	},
});
