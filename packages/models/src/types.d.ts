export interface Serializeable<
	T extends Record<string | number | symbol, unknown>,
> {
	serialize(): { [K in keyof T]: string | number | boolean | Date };
}
