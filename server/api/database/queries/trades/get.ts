import format from "pg-format";
import {
	BackendApiObject as API,
	BackendApiObject,
} from "../../../../database/pools/query-objects";

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
            select to_json(sub.*) "trade", to_json(tickets.*) "ticket" from (
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

		return response as {
			trade: {
				user_id: number;
				trade_id: number;
				ticker: string;
				trade_type: string;
				rank_number: string;
			};
			ticket: {
				user_id: number;
				trade_id: number;
				ticket_id: number;
				ticker: string;
				timestamp: number;
				action: string;
				quantity: number;
				price: number;
			};
		}[];
	} catch (e) {
		console.error(e);
	}
}
