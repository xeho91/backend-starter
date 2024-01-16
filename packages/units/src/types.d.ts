export interface Struct<T> {
	toString: () => string;
	valueOf: () => T;
}

export interface Enum<T extends typeof ReadonlyArray<T>> {
	// TODO: Private identifiers are supported in TypeScript... yet(?)
	// #value: T;
	toString: () => string;
	valueOf: () => T;
}
