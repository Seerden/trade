import type { BuyTicket, SellTicket, Trade } from "types/trade.types";

/**
 * Take an array of tickets in a trade and extract various data, like P&L, quantity,
 * average buy/sell price, etc.
 */
export function getTradeInfo(trade: Trade) {
    return {
        quantity: getTradeQuantity(trade),
        meanBuy: meanPrice(
            trade.filter((trade) => trade.action === "buy") as BuyTicket[]
        ),
        meanSell: meanPrice(
            trade.filter((trade) => trade.action === "sell") as SellTicket[]
        ),
        realized: undefined,
        unrealized: undefined,
    };
}

/**
 * Extract trade quantity from `trade`
 * @todo: currently assume buy and sell quantity are equal, which isn't always true,
 * - trades can be ongoing,
 * - user may accidentally close out more than their original position
 *      in this case we'd typically split up the overshooting ticket,
 *      with the excess shares going into a new trade, so this wouldn't
 *      be a problem
 */
function getTradeQuantity(trade: Trade): number {
    if (!trade.length) return 0;

    const buys = trade.filter((ticket) => ticket.action === "buy");
    const buyQuantity = buys.reduce((acc, cur: BuyTicket) => {
        return acc + cur.quantity;
    }, 0);

    return buyQuantity;
}

/**
 * Compute mean {entry or exit} cost basis for a list of tickets
 * @note: don't compute p&l by subtracting mean buy from mean sell.
 *  Doesn't work when scaling in/out, obviously
 */
function meanPrice(ticketsByAction: BuyTicket[] | SellTicket[]): number {
    let cumulativePriceTimesQuantity = 0;
    let cumulativeQuantity = 0;

    // manual loop slightly more efficient than higher-order functions
    for (const ticket of ticketsByAction) {
        const { price, quantity } = ticket;
        cumulativePriceTimesQuantity += price * quantity;
        cumulativeQuantity += ticket.quantity;
    }

    return cumulativePriceTimesQuantity / cumulativeQuantity;
}
