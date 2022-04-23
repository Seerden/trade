/*  from github.com/seerden/bits/server  */

import { Pool } from "pg";

export type QueryArgs = {
	name?: string;
	values?: any[];
	text: string;
};

/**
 * Construct a pool.query() function for a given `pool`.
 *
 * @usage Use with a database pool to construct an object like
 * {
 *    query: constuctMakePooledQuery(pool),
 *    queries: constuctMakePooledQueries(pool),
 * }
 */
export function constructMakePooledQuery(pool: Pool) {
	/**
	 * Make a single query to the PostgreSQL database.
	 * @returns single `rows` response
	 */
	return async function makePooledQuery<ReturnType = any>(
		queryOptions: QueryArgs
	): Promise<ReturnType> {
		const client = await pool.connect();

		try {
			const { rows } = await client.query({ ...queryOptions });
			// return withCamelCaseKeys(rows) as unknown as ReturnType;
			return rows as unknown as ReturnType;
		} finally {
			client.release();
		}
	};
}

/**
 * Construct a pool.queries() function for a given `pool`.
 *
 * @usage Use with a database pool to construct an object like
 * {
 *    query: constuctMakePooledQuery(pool),
 *    queries: constuctMakePooledQueries(pool),
 * }
 */
export function constructMakePooledQueries(pool: Pool) {
	/**
	 * Make multiple queries to the PostgreSQL database in a single go.
	 * @returns Array of Postgres response rows
	 */
	return async (queries: QueryArgs[]) => {
		const client = await pool.connect();

		try {
			const responses: any[] = [];
			for (const query of queries) {
				const { rows } = await client.query({ ...query });
				// responses.push(withCamelCaseKeys(rows));
				responses.push(rows);
			}
			return responses;
		} finally {
			client.release();
		}
	};
}
