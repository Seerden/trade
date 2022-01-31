import {
    constructMakePooledQueries,
    constructMakePooledQuery,
} from "./construct-query-functions";
import { apiPool, priceActionPool } from "./pools";

export const BackendApiObject = {
    query: constructMakePooledQuery(apiPool),
    queries: constructMakePooledQueries(apiPool),
};

export const PriceActionApiObject = {
    query: constructMakePooledQuery(priceActionPool),
    queries: constructMakePooledQueries(priceActionPool),
};
