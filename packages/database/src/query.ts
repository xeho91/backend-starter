import { loadConfig } from "@packages/config";

import { getQueryClient } from "./client.js";

const config = await loadConfig();

/** Database query client for writing database services. */
export const DB = getQueryClient(config);
