import { apiPool } from "../../../../database/pools/pools";
import { BackendApiObject as API } from "../../../../database/pools/query-objects";
import { NewTicket } from "../../../types/ticket.types";
import { getLatestTrade } from "./get";

type Options = {
	userId: number;
	ticker: string;
	tradeType: "long" | "short";
};

/**
 * Insert a trade row into the database.
 * @todo: do we want to cast ticker to uppercase?
 */
export async function insertTradeRow({ userId, ticker, tradeType }: Options) {
	return await API.query({
		text: "insert into trades(user_id, ticker, trade_type) values($1, $2, $3)",
		values: [userId, ticker, tradeType],
	});
}

/**
 * WIP: given a new ticket from the client, add the correct trade id.
 * - if a new trade has to be inserted, handle that also.
 * - if a ticket closes out a trade but also opens a new one, this should be
 *   handled _before_ this function gets called, so we shouldn't have to account
 *   for that
 */
export async function getTradeIdForNewTicket({
	userId,
	ticket,
}: {
	userId: number;
	ticket: NewTicket;
}) {
	const client = await apiPool.connect();

	try {
		// get latest trade for ticker
		// this probably isn't the best way to do this: getLatestTrade returns the
		// latest trade and all associated tickets. if we have multiple tickets
		// for a ticker, then we're wasting resources by calling this function
		// multiple times. perhaps it's better to call getLatestTrade first,
		// create any necessary new `trades` rows, and then handle getTradeIdForNewTicket
		const latestTrade = await getLatestTrade({ userId, tickers: [ticket.ticker] });
	} finally {
		client.release();
	}
}
