import { getRandomValues } from "node:crypto";

export interface RandomNumberOptions {
	/** @defaultValue Number.MAX_SAFE_INTEGER */
	max?: number;
	/** @defaultValue Number.MIN_SAFE_INTEGER */
	min?: number;
}

/**
 * Get a random **integer** number from the specified range.
 * @param options - range options
 */
export function getRandomInteger(options: RandomNumberOptions = {}) {
	const { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER } =
		options;

	const random = getSafeRandomNumber();
	return Math.floor(random * (max - min + 1) + min);
}

/**
 * Get a random 'float' number **_(with decimals!)_** from the specified range.
 * @param options - range options
 */
export function getRandomNumber(options: RandomNumberOptions = {}) {
	const { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER } =
		options;

	return getSafeRandomNumber() * (max - min) + min;
}

function getSafeRandomNumber() {
	const random = getRandomValues(new Uint32Array(1)).at(0) as number;
	/**
	 * NOTE: `0xff_ff_ff_ff` aka (`0xFFFFFFF`) - Uint32 Max value represent in hexadecimal format `+1` - because
	 * Math.random is inclusive of 0, but not 1 Credits: https://stackoverflow.com/a/62792582.
	 */
	return random / (0xff_ff_ff_ff + 1);
}

export function getRandomIndex(length: number) {
	return getRandomInteger({ min: 0, max: length - 1 });
}

export function getRandomItem<Type = unknown>(
	array: Array<Type> | readonly Type[],
) {
	return array.at(getRandomIndex(array.length)) as Type;
}

interface GetRandomItemsOptions {
	/**
	 * A positive integer, with a count of how many random items you want to be picked.
	 */
	count?: number;
}

/**
 * NOTE: **It could create duplicates**.
 * @param array - array to get random items from
 * @param options - randomizing options
 */
export function getRandomItems<Type = unknown>(
	array: Array<Type> | readonly Type[],
	options: GetRandomItemsOptions = {},
): Array<Type> {
	const { count = 1 } = options;
	const results: Array<Type> = [];

	while (results.length < count) {
		results.push(getRandomItem(array));
	}

	return results;
}
