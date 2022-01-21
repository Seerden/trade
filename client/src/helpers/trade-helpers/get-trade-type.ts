import { Trade, TradeAction, TradeType } from "types/trade.types";

/**
 * Sort a trade's tickets by timestamp in ascending order
 */
function sortByTimestamp(trade: Trade) {
    return trade.sort((a, b) =>
        a.timestamp === b.timestamp ? 0 : a.timestamp > b.timestamp ? 1 : -1
    );
}

/**
 * Determine from a trade's tickets whether it's a long or short position
 */
export function longOrShort(trade: Trade) {
    const sortedTrade = sortByTimestamp(trade);

    return sortedTrade[0].action === TradeAction.BUY ? TradeType.LONG : TradeType.SHORT;
}
