/*  from github.com/seerden/bits/server  */

import pool from "./pool";

export type QueryArgs = {
    name?: string;
    values?: any[];
    text: string;
};

/**
 * Make a single query to the PostgreSQL database.
 * @returns single `rows` response
 */
export async function makePooledQuery<ReturnType = any>(
    queryOptions: QueryArgs
): Promise<ReturnType> {
    const client = await pool.connect();

    try {
        const { rows } = await client.query({ ...queryOptions });
        // return withCamelCaseKeys(rows) as unknown as ReturnType;
        return rows as unknown as ReturnType;
    } catch (e) {
        throw e;
    } finally {
        client.release();
    }
}

/**
 * Make multiple queries to the PostgreSQL database in a single go.
 * @returns Array of Postgres response rows
 */
export async function makePooledQueries(queries: QueryArgs[]) {
    const client = await pool.connect();

    try {
        let responses: any[] = [];
        for (const query of queries) {
            let { rows } = await client.query({ ...query });
            // responses.push(withCamelCaseKeys(rows));
            responses.push(rows);
        }
        return responses;
    } catch (e) {
        throw e;
    } finally {
        client.release();
    }
}
