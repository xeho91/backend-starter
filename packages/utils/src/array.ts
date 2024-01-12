import { z } from "zod";

export function chunkArray<T>(
	array: Array<T>,
	limit: number,
): Array<Array<T>> | Array<T> {
	if (array.length <= limit) {
		return array;
	}

	// const cloned = structuredClone(array);
	const cloned = [...array];
	const chunks: Array<Array<T>> = [];

	while (cloned.length > limit) {
		const removed = cloned.splice(0, limit);

		chunks.push(removed);
	}

	chunks.push(cloned);

	return chunks;
}

export function isChunkedArray(value: unknown): value is Array<Array<unknown>> {
	return z.array(z.array(z.unknown())).safeParse(value).success;
}
