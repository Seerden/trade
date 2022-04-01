/**
 * Test execution time of a bunch of separate database inserts
 */
export async function insertManyTrades() {
	console.time("insertManyTrades");

	// ---- insert one row at a time
	// for (let i = 0; i < 100; i += 1) {
	// 	await insertTradeRow({
	// 		userId: 18,
	// 		ticker: "TEST",
	// 		tradeType: "short",
	// 	});
	// }

	// ---- insert all of them in 1 transaction
	// const rows = Array(100).fill([18, "msft", "short"]);
	// await BackendApiObject.query({
	// 	text: format("insert into trades (user_id, ticker, trade_type) values %L", rows),
	// });

	// ---- use API.queries; 100 separate queries, but in one pool/connection
	// const queries: QueryArgs[] = Array(100).fill({
	// 	text: "insert into trades (ticker, user_id, trade_type) values ($1, $2, $3)",
	// 	values: ["msft", 18, "short"],
	// });
	// BackendApiObject.queries(queries);

	console.timeEnd("insertManyTrades");
}
