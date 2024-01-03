/**
 * Extend the map into map - from left to right
 * @param left - a base map
 * @param right - a map to extend into base map
 */
export function extendMap<KL, KR, VL, VR>(
	left: Map<KL | KR, VL | VR>,
	right: Map<KR, VR>,
) {
	for (const [key, value] of right) {
		left.set(key, value);
	}

	return left;
}
