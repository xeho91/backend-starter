/**
 * Print JSON data with identation
 * @param data - a valid JSON-compatible data.
 */
export function prettyJSON(data: unknown) {
	if (data === undefined) {
		throw new TypeError(`Data must be a valid JSON syntax.`);
	} else {
		return JSON.stringify(data, undefined, 2);
	}
}
