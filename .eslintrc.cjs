/** @type {import("eslint").Linter.Config} */
const config = {
	extends: ["@terminal-nerds"],
	plugins: ["drizzle"],
	rules: {
		"unicorn/no-null": ["off"],
	},
};

module.exports = config;
