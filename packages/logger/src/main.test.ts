import { afterAll, describe, expect, test, vi } from "vitest";

import { log, LOG_LEVELS } from "./main.ts";

describe("log", () => {
	const message = "this is a test";

	for (const level of LOG_LEVELS) {
		const logMock = vi.spyOn(log, level).mockImplementation(() => {});

		test(`.${level}("${message}") succeed`, () => {
			log[level](message);
			expect(logMock).toHaveBeenCalledOnce();
			expect(logMock).toHaveBeenLastCalledWith(message);
		});

		afterAll(() => {
			logMock.mockReset();
		});
	}
});
