export type CleanUndefinedValues<O> = {
	[K in keyof O]-?: Exclude<O[K], undefined>;
};

/**
 * Clean the object entries which has `undefined` value.
 * Useful for database queries, so it doesn't override anything or satisfy the required types with partial entries of
 * schema.
 * @param dirty - dirty object
 */
export function cleanUndefinedValues<const O extends object>(dirty: O) {
	const clean = {} as CleanUndefinedValues<O>;

	for (const [key, value] of Object.entries(dirty)) {
		if (value !== undefined) {
			Object.assign(clean, { [key]: value });
		}
	}

	return clean;
}

/**
 * Get the typed object keys.
 * @param object - object from whose you want to return it's keys as typed array.
 */
export function typedObjectKeys<T extends object>(object: T) {
	return Object.keys(object) as (keyof T)[];
}
