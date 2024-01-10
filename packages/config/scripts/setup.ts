import fs from "node:fs";
import path from "node:path";

import { log } from "@packages/logger";
import { findWorkspaceRootPath } from "@packages/path";
import { typedObjectKeys } from "@packages/utils/object";
import Enquirer from "enquirer";
import {
	ZodBoolean,
	ZodDefault,
	ZodEffects,
	ZodEnum,
	ZodNumber,
	type ZodTypeAny,
} from "zod";

import { CONFIG_SCHEMA, type EnvironmentVariable } from "../src/main.js";

const { prompt } = Enquirer;
const WORKSPACE_ROOT = await findWorkspaceRootPath();
const DOTENV_PATH = path.join(WORKSPACE_ROOT, ".env");

async function main() {
	const answers = await promptQuestions();
	const content: string = [...answers.entries()]
		.map(([key, value]) => `${key}="${value}"`)
		.join("\n");

	fs.writeFileSync(DOTENV_PATH, content, { encoding: "utf8" });
	log.info(
		`Successfully saved environment variables in: file://${DOTENV_PATH}`,
	);
}

async function promptQuestions() {
	const answers: Map<EnvironmentVariable, string> = new Map();

	for (const [variable, options] of getPromptOptions().entries()) {
		const answer: Record<keyof typeof CONFIG_SCHEMA, string> =
			await prompt(options);

		answers.set(variable, String(answer[variable]));
	}

	return answers;
}

function getPromptOptions() {
	const questions: Map<EnvironmentVariable, Parameters<typeof prompt>[0]> =
		new Map();

	for (const variable of typedObjectKeys(CONFIG_SCHEMA)) {
		const schema = CONFIG_SCHEMA[variable];

		questions.set(variable, {
			...setPromptType(schema),
			name: variable,
			message: `(${schema.description}) ${variable}=`,
			...setValidate(variable),
		});
	}

	return questions;
}

function setValidate(variable: EnvironmentVariable) {
	return {
		validate(value: unknown) {
			const schema = CONFIG_SCHEMA[variable];
			try {
				return typeof value === "object" && value && "name" in value
					? schema.safeParse(value["name"]).success
					: schema.safeParse(value).success;
			} catch {
				return false;
			}
		},
	};
}

function setPromptType(schema: (typeof CONFIG_SCHEMA)[EnvironmentVariable]) {
	const initial = getDefaultValue(schema);
	const z = getType(schema);

	if (z instanceof ZodEnum) {
		return {
			type: "autocomplete",
			choices: Object.keys(z.Values),
			initial: 0,
		} as const;
	}

	if (z instanceof ZodBoolean) {
		return {
			type: "confirm",
			...(initial !== undefined && { initial }),
		} as const;
	}

	if (z instanceof ZodNumber) {
		return {
			type: "number",
			...(initial !== undefined && { initial }),
		} as const;
	}

	if (
		z instanceof ZodEffects &&
		"transform" in z._def.effect &&
		z._def.effect.transform.toString().includes("new Password")
	) {
		return {
			type: "password",
		} as const;
	}

	return {
		type: "input",
		...(initial !== undefined && { initial }),
	} as const;
}

function getDefaultValue(schema: ZodTypeAny) {
	if (schema instanceof ZodDefault) {
		return schema._def.defaultValue();
	}
}

function getType(schema: ZodTypeAny): unknown {
	return schema._def?.typeName === "ZodDefault"
		? getType(schema._def.innerType)
		: schema;
}

log.info("Running a script to setup the dotenv at the root of workspace...");
await main();
log.info("Setup dotenv finished!");
