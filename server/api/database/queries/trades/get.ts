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
	const { rows } = await BackendApiObject.query({
		text: format(
			`
            select * from (
               select t.*, rank() over (
                  partition by t.ticker
                  order by t.trade_id desc
               ) rank_number 
               from trades t 
               where t.ticker in %L
               and t.user_id = %I
            ) sub
            where sub.rank_number = 1
         `,
			[tickers, userId]
		),
	});

	return rows;
}
