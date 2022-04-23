import { Pool } from "pg";
import {
	apiPoolConfig,
	DatabasePoolCredentials,
	pricePoolConfig,
} from "./pool-credentials";

/**
 * Create a database pool using some predefined config options, and some
 * specified `poolCredentials`.
 */
function createPool(poolCredentials: DatabasePoolCredentials) {
	return new Pool({
		...poolCredentials,
		max: 10,
		idleTimeoutMillis: 15000,
		connectionTimeoutMillis: 2000,
	});
}

export const apiPool = createPool(apiPoolConfig);
export const pricePool = createPool(pricePoolConfig);
