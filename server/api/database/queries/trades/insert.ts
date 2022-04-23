import { API } from "../../../../database/pools/apis";
import type { Trade } from "../../../../types/database.types";

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
	const [insertedRow] = await API.query({
		text: `
         insert into trades(user_id, ticker, trade_type) values($1, $2, $3)
         returning *
      `,
		values: [userId, ticker, tradeType],
	});

	return insertedRow as Trade;
}
