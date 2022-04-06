import format from "pg-format";
import {
	BackendApiObject as API,
	BackendApiObject,
} from "../../../../database/pools/query-objects";
import { getUserId } from "../users/get";

// TODO: I'm not 100% sure this is the correct response type for getLatestTrade
// (it's correct for getTradesWithTickets though). Test with multiple tickers.
// Might have to `group by trade.trade_id` in getLatestTrade to get the desired shape.
export type TradeWithTickets = {
	trade: null | {
		user_id: number;
		trade_id: number;
		ticker: string;
		trade_type: string;
		rank_number: string;
	};
	tickets:
		| null
		| {
				user_id: number;
				trade_id: number;
				ticket_id: number;
				ticker: string;
				timestamp: number;
				action: "buy" | "sell";
				quantity: number;
				price: number;
		  }[];
};
export type TradesWithTickets = TradeWithTickets[];

/**
 * Fetch all of a single user's trades.
 */
export function getTradesByUser({ userId }: { userId: number }) {
	API.query({
		text: "select * from trades where user_id = $1",
		values: [userId],
	});
}

/**
 * Get a user's latest trade for each of the provided `tickers`.
 */
export async function getLatestTrade({
	userId,
	tickers,
}: {
	userId: number;
	tickers: string[];
}) {
	try {
		const text = format(
			`
            select jsonb_agg(distinct to_jsonb(sub.*)) as trade, jsonb_agg(to_jsonb(tickets.*)) as tickets from (
               select t.*, rank() over (
                  partition by t.ticker
                  order by t.trade_id desc
               ) rank_number 
               from trades t 
               where t.ticker in (%L)
               and t.user_id = %L
            ) sub
            inner join tickets
            on tickets.trade_id = sub.trade_id
            and sub.rank_number = 1
         `,
			tickers,
			userId
		);

		const response = await BackendApiObject.query({ text });

		return response as TradesWithTickets;
	} catch (e) {
		console.error(e);
	}
}

export async function getTradesWithTickets(username: string, tickers?: string[]) {
	const userId = await getUserId(username);
	console.log(userId);
	if (!userId) return;

	// Build query
	const text = format(
		`
         select jsonb_agg(distinct tr.*) as trade, jsonb_agg(ti.* order by timestamp asc) as tickets
         from trades tr
         inner join tickets ti
         on ti.trade_id = tr.trade_id
         and tr.user_id = %L
         ${Array.isArray(tickers) && tickers?.length ? "and tr.ticker in (%L)" : ""}
         group by tr.trade_id
      `,
		userId,
		tickers
	);

	// TODO: if no trades are returned, do we get []?
	const response: [] | TradesWithTickets = await BackendApiObject.query({ text });

	return response;
}
