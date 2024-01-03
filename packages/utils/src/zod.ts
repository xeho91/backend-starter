import { z } from "zod";

import { typedObjectKeys } from "./object.js";

/**
 * Get the zod enum type from the object keys.
 * @param object - a readonly object from whose keys should be extracted as enum
 */
export function enumFromObjectKeys<K extends string>(
	object: Readonly<Record<K, unknown>>,
): z.ZodEnum<[K, ...K[]]> {
	const [firstKey, ...otherKeys] = typedObjectKeys(object);

	return z.enum([firstKey!, ...otherKeys]);
}
