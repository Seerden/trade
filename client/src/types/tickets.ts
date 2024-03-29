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

// @todo: this should be Tickets...
export type Ticket = Array<BuyTicket | SellTicket>;

export type NewTicket = {
	ticker: string;
	price: number;
	quantity: number;
	timestamp: number;
	action: "buy" | "sell";
};

// POST t/tickets returns { savedTickets: SavedTicket[] }
export type SavedTicket = {
	user_id: number;
   trade_id: number;
	ticket_id: number;
	ticker: string;
	timestamp: string;
   action: TradeAction;
	quantity: string;
	price: string;
};
