import format from "pg-format";
import { BackendApiObject as API } from "../../../../database/pools/query-objects";
import { NewTicket } from "../../../types/ticket.types";
import { getTradeIds } from "../trades/get";
import { getUserId } from "../users/get";

// WHERE THE FUCK AM I KEEPING THESE TYPES?

/**
 * Insert a list of new tickets into the database
 */
export async function insertTickets(username: string, tickets: Array<NewTicket>) {
    /**
     * create a list that's usable with pg-format
     *
     * so go
     *  from    Array<Ticket>
     *  to      Array<[user_id, ticker, timestamp, action, ...]>
     */

    const fields = "ticker, timestamp, action, quantity, price".split(", ");
    const userId = await getUserId(username);
    const tradeIds = await getTradeIds(tickets);
    const ticketsAsArrays = tickets.map((ticket, index) =>
        fields.reduce(
            (
                acc: Array<NewTicket[keyof NewTicket]>,
                field: NewTicket[keyof NewTicket]
            ) => {
                // @ts-ignore - reducing into a array with variable types is.. hacky
                acc.push(ticket[field]);
                return acc;
            },
            // userId isn't part of the newTickets array passed from the
            // frontend, so add it to `acc` manually
            [userId, tradeIds[index]]
        )
    );

    API.query({
        text: format(`
            insert into tickets (
                user_id, -- @todo: instead of typing out the fields, re-use the 'fields' variable from above
                ticker, 
                timestamp, 
                action, 
                quantity, 
                price
            ) values %L
        `),
        values: ticketsAsArrays,
    });
}
