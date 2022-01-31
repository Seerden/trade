import { Pool } from "pg";
import { DatabasePoolCredentials } from "../../types/pool.types";

export function constructDatabasePool(poolCredentials: DatabasePoolCredentials) {
    return new Pool({
        ...poolCredentials,
        max: 10,
        idleTimeoutMillis: 15000,
        connectionTimeoutMillis: 2000,
    });
}
