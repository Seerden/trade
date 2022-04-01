import { BackendApiObject as API } from "../../../../database/pools/query-objects";

type Options = {
	userId: number;
	ticker: string;
	tradeType: "long" | "short";
};

/*
    Insert trade rows into the database.
    trade has 
    user_id: number (foreign key on `users`) 
    trade_id: number (auto-incremented sequentially generated int), 
    ticker: string (like MSFT - undecided if we want to store them in uppercase
    or lowercase),
    trade_type: long/short

*/

export async function insertTradeRow({ userId, ticker, tradeType }: Options) {
	return await API.query({
		text: "insert into trades(user_id, ticker, trade_type) values($1, $2, $3)",
		values: [userId, ticker, tradeType],
	});
}
