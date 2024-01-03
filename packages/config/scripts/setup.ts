import fs from "node:fs";
import path from "node:path";

import { log } from "@packages/logger";
import { findWorkspaceRootPath } from "@packages/path";
import Enquirer from "enquirer";
import { z } from "zod";

import { CONFIG_SCHEMA } from "../src/main.js";

const { prompt } = Enquirer;

async function main() {
	const schema = CONFIG_SCHEMA.getSchema();
	const questions: Array<Parameters<typeof prompt>[0]> = [];
	const variables = getEnvironmentVariableNames(
		schema as unknown as InternalSchema,
	);

	for (const [variable, schema] of variables) {
		questions.push(setPrompt(variable, schema));
	}
	// @ts-ignore FIXME: No idea how to fix this typing issue for now
	const answers = await prompt(questions);
	const content: string = Object.entries(answers)
		.map(([key, value]) => `${key}=${value}`)
		.join("\n");
	const workspaceRoot = await findWorkspaceRootPath();
	const dotenvPath = path.join(workspaceRoot, ".env");

	fs.writeFileSync(dotenvPath, content, { encoding: "utf8" });
	log.info(
		`Successfully saved environment variables in: file://${dotenvPath}`,
	);
}

const FORMAT_SCHEMA = z
	.literal("boolean")
	.or(z.literal("int"))
	.or(z.literal("ipaddress"))
	.or(z.literal("port"));
const VARIABLE_SCHEMA = z.object({
	doc: z.string(),
	default: z.optional(z.boolean().or(z.number()).or(z.string())),
	format: z.optional(FORMAT_SCHEMA.or(z.array(z.string()))),
	env: z.optional(z.string()),
});
type VariableSchema = z.infer<typeof VARIABLE_SCHEMA>;

function setPrompt(
	variable: string,
	schema: VariableSchema,
): Parameters<typeof prompt>[0] {
	const { doc, format } = schema;
	const name = variable;
	const message = `${doc} ${variable}=`;

	if (Array.isArray(format)) {
		return {
			type: "autocomplete",
			name,
			message,
			initial: 0,
			choices: format,
		};
	}

	if (format === "boolean") {
		return {
			type: "confirm",
			name,
			message,
			initial: schema.default,
			validate(value) {
				return z.boolean().safeParse(value).success;
			},
		};
	}

	if (format === "ipaddress") {
		return {
			type: "input",
			name,
			message,
			validate(value) {
				return z
					.string()
					.ip({ version: "v4" })
					.or(z.string().ip({ version: "v6" }))
					.safeParse(value).success;
			},
			initial: schema.default,
		};
	}

	if (format === "port") {
		return {
			type: "number",
			name,
			message,
			initial: schema.default,
			validate(value) {
				return z.number().min(1024).max(65_535).safeParse(value)
					.success;
			},
		};
	}

	if (format === "int") {
		return {
			type: "number",
			name,
			message,
			initial: schema.default,
			validate(value) {
				return z.number().min(0).safeParse(value).success;
			},
		};
	}

	if (variable.includes("PASS")) {
		return {
			type: "password",
			name,
			message,
			validate(value) {
				return z.string().min(16).safeParse(value).success;
			},
		};
	}

	return {
		type: "input",
		name,
		message,
		initial: schema.default,
		validate(value) {
			return z.string().min(6).safeParse(value).success;
		},
	};
}

function getEnvironmentVariableNames(schema: VariableSchema | InternalSchema) {
	const variables: Map<string, VariableSchema> = new Map();

	if (isInternalSchema(schema)) {
		for (const [_name, propertySchema] of Object.entries(
			schema._cvtProperties,
		)) {
			extendMap(variables, getEnvironmentVariableNames(propertySchema));
		}
	} else {
		addVariableToMap(schema, variables);
	}

	return variables;
}

function extendMap<
	L extends Map<unknown, unknown>,
	R extends Map<unknown, unknown>,
>(left: L, right: R) {
	for (const [key, value] of right) {
		left.set(key, value);
	}

	return left;
}

const NESTED_SCHEMA = z.object({
	_cvtProperties: z.record(z.string(), VARIABLE_SCHEMA),
});
const INTERNAL_SCHEMA = z.object({
	_cvtProperties: z.record(z.string(), VARIABLE_SCHEMA.or(NESTED_SCHEMA)),
});
type InternalSchema = z.infer<typeof INTERNAL_SCHEMA>;
function isInternalSchema(schema: unknown): schema is InternalSchema {
	return INTERNAL_SCHEMA.safeParse(schema).success;
}

function addVariableToMap(
	schema: VariableSchema,
	map: Map<string, VariableSchema>,
) {
	if ("env" in schema && typeof schema.env === "string" && schema.env) {
		map.set(schema.env, schema);
	}
}

log.info("Running a script to setup the dotenv at the root of workspace...");
await main();
log.info("Setup dotenv finished!");
