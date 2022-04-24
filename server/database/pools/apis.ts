import { apiPool, pricePool } from "./construct-pool";
import {
	constructMakePooledQueries,
	constructMakePooledQuery,
} from "./construct-query-functions";

/**
 * Exposes .query() and .queries(), which can be used to initialize, respectively,
 * one or multiple transactions for our API (corresponding to our `api_database`
 * service).
 */
export const API = {
	query: constructMakePooledQuery(apiPool),
	queries: constructMakePooledQueries(apiPool),
};

/**
 * Exposes .query() and .queries(), which can be used to initialize, respectively,
 * one or multiple transactions for our price action API (corresponding to our
 * `database` service).
 */
export const PriceAPI = {
	query: constructMakePooledQuery(pricePool),
	queries: constructMakePooledQueries(pricePool),
};
