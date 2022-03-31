import format from "pg-format";
import { BackendApiObject as API } from "../../../../database/pools/query-objects";
import { NewTicket } from "../../../types/ticket.types";
import { getTradeIds } from "../trades/get";
import { getUserId } from "../users/get";

const newTicketFields = "ticker timestamp action quantity price".split(" ") as Array<
	keyof NewTicket
>;

interface TicketForDatabase extends NewTicket {
	userId: number;
	tradeId: number;
}

const ticketForDatabaseFields = [...newTicketFields, "userId", "tradeId"] as Array<
	keyof TicketForDatabase
>;

/**
 * TODO: currently, addIdPropsToTicket and ticketObjectToArray are unused,
 * we first need to
 * - [x] add a new type that extends NewTicket with userId and tradeId props (are
 *   they numbers, or strings?)
 * - [x] change the `fields` variable (see above) to include userId and tradeId props
 * - add trade_id property to the database insert
 *  - actually, do we want to do this? think so
 *
 * Then we can use these two functions in the creation of ticketsAsArrays in insertTickets.
 * Note the order of the fields we insert into the database.
 *
 */

/**
 * Take a raw newTicket object, e.g. as expected to be sent from the client,
 * and add properties `userId` and `tradeId` to it
 */
function addIdPropsToTicket(ticket: NewTicket, userId: number, tradeId: number) {
	return { ...ticket, userId, tradeId };
}

/**
 * Take a newTicket object like {
 *    ticker,
 *    timestamp,
 *    action,
 *    quantity,
 *    price
 * }
 *
 * and convert it to an array like [
 *    ticker,
 *    timestamp,
 *    action,
 *    quantity,
 *    price
 * ]
 */
function ticketObjectToArray(ticket: TicketForDatabase) {
	const array = [];

	for (const field of ticketForDatabaseFields) {
		if (field in ticket) {
			array.push(ticket[field]);
		}
	}

	return array;
}

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

	const userId = await getUserId(username);
	const tradeIds = await getTradeIds(tickets);
	const ticketsAsArrays = tickets.map((ticket, index) =>
		newTicketFields.reduce(
			(acc: Array<NewTicket[keyof NewTicket]>, field: NewTicket[keyof NewTicket]) => {
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
