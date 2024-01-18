import crypto from "node:crypto";

import type { Join, NonNegativeInteger, Split } from "type-fest";
import { z } from "zod";

import type { Struct } from "../types.js";

type Value = [string, string, `4${string}`, string, string];
export type StringifiedUuid = Join<Value, "-">;
type Splitted = Split<StringifiedUuid, "-">;

export type UuidType = StringifiedUuid | Uuid;

export class Uuid implements Struct<StringifiedUuid> {
	/** Zod default _(without transformation)_ schema, to parse **without** instance. */
	public static schema() {
		return z.string().uuid();
	}

	/**
	 * Check if the provided value will be valid to create an instance.
	 * @param value - base to create enum value from
	 */
	public static isValid(value: unknown): value is StringifiedUuid {
		return this.schema().safeParse(value).success;
	}

	/** Zod extended _(with transformation)_ schema, to parse **with** instance. */
	public static extendedSchema() {
		return this.schema()
			.transform((v) => new this(v as StringifiedUuid))
			.or(z.instanceof(this));
	}

	public static generate() {
		return new this(crypto.randomUUID() as StringifiedUuid);
	}

	#value: Value;

	constructor(value: StringifiedUuid | string) {
		this.#value = Uuid.schema().parse(value).split("-") as Splitted;
	}

	public get grouped() {
		return this.#value;
	}

	private group<N extends number>(index: NonNegativeInteger<N>) {
		return this.#value.at(index) as Value[N];
	}

	public get firstGroup() {
		return this.group(0);
	}

	public get leftRandomGroup() {
		return this.group(1);
	}

	public get versionGroup() {
		return this.group(2);
	}

	public get rightRandomGroup() {
		return this.group(3);
	}

	public get lasttGroup() {
		return this.group(4);
	}

	/**
	 * Optimized Uuid comparision
	 * @param opposite - opposite uuid to compare with
	 */
	public isEqualTo(opposite: Uuid): boolean {
		if (
			this.firstGroup !== opposite.firstGroup ||
			this.lasttGroup !== opposite.lasttGroup ||
			this.leftRandomGroup !== opposite.leftRandomGroup ||
			this.rightRandomGroup !== opposite.rightRandomGroup
		) {
			return false;
		}

		return this.versionGroup === opposite.versionGroup;
	}

	public toString() {
		return this.#value.join("-") as StringifiedUuid;
	}

	public valueOf() {
		return this.toString();
	}
}
