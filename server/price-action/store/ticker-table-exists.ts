import { redisClient } from "../../store/redis-client";
import { Timescale } from "../../types/store.types";

export async function maybeAddTableToSet(ticker: string, timescale: Timescale) {
    try {
        await redisClient.sAdd(`ticker-tables:${timescale}`, ticker.toLowerCase());
        return { ticker, timescale };
    } catch (error) {
        console.error(error);
    }
}

/**
 * Check our redis store to see whether table for (ticker, timescale) exists
 */
export async function tickerTableExists(ticker: string, timescale: Timescale) {
    const exists = await redisClient.sIsMember(
        `ticker-tables:${timescale}`,
        ticker.toLowerCase()
    );
    return exists;
}
