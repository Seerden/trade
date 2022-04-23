import { config } from "dotenv";
import { PoolConfig } from "pg";

config();

export type DatabasePoolCredentials = Pick<
	PoolConfig,
	"host" | "user" | "database" | "password"
>;

const {
	DB_HOST,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_DATABASE,
	API_DB_HOST,
	PG_API_USER,
	PG_API_PASS,
	PG_API_DB,
} = process.env;

/**
 * Partial pool config for the `database` service, i.e. the price action database.
 */
export const priceActionDatabasePoolCredentials: DatabasePoolCredentials = {
	host: DB_HOST,
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
	database: POSTGRES_DATABASE,
};

/**
 * Partial pool config for the `api-database` service, i.e. the database for our own API.
 */
export const apiDatabasePoolCredentials: DatabasePoolCredentials = {
	host: API_DB_HOST,
	user: PG_API_USER,
	password: PG_API_PASS,
	database: PG_API_DB,
};
