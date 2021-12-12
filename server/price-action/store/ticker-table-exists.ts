import { redisClient } from "../../store/redis-client";
import { Timescale } from "../../types/store.types";

export async function maybeAddTableExistsKey(ticker: string, timescale: Timescale) {
    try {
        await redisClient.sAdd(`ticker-tables:${timescale}`, ticker.toLowerCase());
        return { ticker, timescale };
    } catch (error) {
        console.error(error);
    }
}

/**
 * Returns 0 if ticker table doesn't exist for given timescale, and 1 if it does exist
 */
export async function tickerTableExists(ticker: string, timescale: Timescale) {
    const exists = await redisClient.sIsMember(`ticker-tables:${timescale}`, ticker);
    return exists;
}
