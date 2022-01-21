export enum TradeAction {
    BUY = "buy",
    SELL = "sell",
}

export enum TradeType {
    LONG = "long",
    SHORT = "short",
}

/** Ticket without `action` */
export type TicketBase = {
    ticker: string;
    price: number;
    quantity: number;
    timestamp: number;
};

/** Ticket with `action === 'buy'` */
export interface BuyTicket extends TicketBase {
    action: `${TradeAction.BUY}`;
}

/** Ticket with `action === 'sell'` */
export interface SellTicket extends TicketBase {
    action: `${TradeAction.SELL}`;
}

export type Trade = Array<BuyTicket | SellTicket>;
