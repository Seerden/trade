import { config } from "dotenv";
import { Pool } from "pg";

config();

const { DB_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE } = process.env;

const pool = new Pool({
    host: DB_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    max: 10,
    idleTimeoutMillis: 15000,
    connectionTimeoutMillis: 2000,
});

export default pool;
