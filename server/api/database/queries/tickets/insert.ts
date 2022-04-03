/* eslint-disable no-continue */
import format from "pg-format";
import { BackendApiObject } from "../../../../database/pools/query-objects";
import { NewTicket, Ticket } from "../../../types/ticket.types";
import { getLatestTradeByTickerWithTickets } from "../trades/get";
import { insertTradeRow } from "../trades/insert";
import { getUserId } from "../users/get";

const newTicketFields = "ticker timestamp action quantity price".split(" ") as Array<
	keyof NewTicket
>;

interface TicketForDatabase extends NewTicket {
	user_id: number;
	trade_id: number;
}

const ticketForDatabaseFields = [...newTicketFields, "user_id", "trade_id"] as Array<
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
 * Given two numbers (`prev` and `next`) representing a state change, check
 * whether going from prev to next leads to a sign flip.
 */
function flippedSign(prev: number, next: number) {
	return prev * next < 0;
}

function haveSameSign(a: number, b: number) {
	if (a === 0 && b === 0) return true; // edge case, shouldn't really happen
	return a * b > 0;
}

type Args = {
	username: string;
	tickets: NewTicket[];
};
/**
 * Insert a list of new tickets into the database
 */
export async function insertTickets({ username, tickets }: Args) {
	const userId = await getUserId(username);

	if (!userId) {
		return;
	}

	const tickers = Array.from(new Set(tickets.map((ticket) => ticket.ticker)));

	// Assign the correct trade_id to each to-be-inserted ticket,
	// which might involve inserting new rows into `trades` first.
	const latestTrades = await getLatestTradeByTickerWithTickets({ userId, tickers });

	// We'll be appending tickets here after assigning a trade_id to each ticket
	const ticketsToInsert: Omit<Ticket, "ticket_id">[] = [];

	// Get position size of each open trade
	for (const ticker of tickers) {
		const latestTrade = latestTrades?.find((t) => t.trade?.ticker === ticker);

		const ticketsForTicker = tickets.filter((t) => t.ticker === ticker);

		const openTrade = latestTrade?.trade ?? null;
		const openTickets = latestTrade?.tickets ?? null;

		let openTradeId: number;

		let openQty: number = openTickets?.length
			? openTickets?.reduce((acc, cur) => {
					if (cur.action === "buy") {
						return acc + cur.quantity;
					}
					return acc - cur.quantity;
			  }, 0)
			: 0;

		if (openTrade) {
			openTradeId = openTrade.trade_id;
		} else {
			const tradeType = ticketsForTicker[0].action === "buy" ? "long" : "short";
			const insertedTrade = await insertTradeRow({
				userId,
				ticker,
				tradeType,
			});
			openTradeId = insertedTrade.trade_id;
		}

		for (const ticket of ticketsForTicker) {
			const { action, quantity } = ticket;
			const signedQty = (action === "buy" ? 1 : -1) * quantity;
			const newQty = openQty + signedQty;

			// TODO: if newQty has flipped sign w.r.t openQty, then we have to split the
			// ticket into two

			if (openQty === 0) {
				// ticket is the first ticket in a new trade, which means we have to
				// create a `trades` row
				const tradeType = action === "buy" ? "long" : "short";
				const insertedTrade = await insertTradeRow({
					userId,
					ticker,
					tradeType,
				});

				openTradeId = insertedTrade.trade_id;
			} else if (
				haveSameSign(openQty, signedQty) || // ticket adds to position
				newQty === 0 // ticket closes out position
			) {
				// ticket belongs to current trade
				openQty = newQty;
			}

			// Assign trade_id and user_id and push the ticket to ticketsToInsert
			const ticketToInsert: Omit<Ticket, "ticket_id"> = {
				...ticket,
				trade_id: openTradeId,
				user_id: userId,
			};

			ticketsToInsert.push(ticketToInsert);
		}
	}

	const ticketsAsArrays = ticketsToInsert.map((ticket) => ticketObjectToArray(ticket));

	const response = await BackendApiObject.query({
		text: format(
			`
            insert into tickets (
               ticker, timestamp, action, quantity, price, user_id, trade_id
            ) values %L returning *
         `,
			ticketsAsArrays
		),
	});

	return response;
}
