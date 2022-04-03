/*
    ticket as it comes from the frontend
    it should be validated on the frontend to prevent unnecessary request, but
    we don't _have_ to do everything over there. 

    @note unify this with frontend NewTicket type.

    @todo: I've temporarily copy-pasted the BuyTicket | SellTicket definition
    from the client into NewTicket, below. We should symlink/path math a types
    folder so we can share types across front- and backend
*/

export type NewTicket = {
	ticker: string;
	price: number;
	quantity: number;
	timestamp: number;
	action: "buy" | "sell";
};

/*
    ticket as it's stored in the database. this includes fields that aren't yet
    available in NewTicket, like the ticket id that's created on database
    insert.
    
    make sure to keep this updated whenever the database definition changes
    @see server\api\database-setup\03_create-tickets.sql

    @note of course we're storing everything in snake_case on the database
        options for parsing to camelCase:
            1. use the generic helper I've used in other projects
            2. create mapping objects for each database table
*/
export type Ticket = {
	user_id: number;
	trade_id: number;
	ticket_id: number;
	ticker: string;
	/** unix timestamp (in seconds? milliseconds? unsure) */
	timestamp: number;
	action: "buy" | "sell";
	quantity: number;
	/**
	 * transaction price
	 * @note this might actually be a string, unsure how numeric fields get passed from the database
	 */
	price: number; //
};
