import { PoolConfig } from "pg";

export type DatabasePoolCredentials = Pick<
    PoolConfig,
    "host" | "user" | "database" | "password"
>;
